"use client"

import { useState, useEffect } from 'react'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { chatSession } from '@/utils/GeminiAImodel'
import { LoaderPinwheel, PlusCircle, Mic, Sparkles, Briefcase, FileText, CalendarCheck } from 'lucide-react'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { db } from '@/utils/db'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

function AddNewInterview() {
  const [OpenDialog, setOpenDialog] = useState(false)
  const [JobPosition, setJobPosition] = useState('')
  const [JobDescription, setJobDescription] = useState('')
  const [YearsOfExperience, setYearsOfExperience] = useState('')
  const [Loading, setLoading] = useState(false)
  const [Suggesting, setSuggesting] = useState(false)
  const [JsonResponse, setJsonResponse] = useState([])
  const [showVoiceBanner, setShowVoiceBanner] = useState(false)

  const router = useRouter()
  const { user } = useUser()

  useEffect(() => {
    localStorage.setItem("jobPosition", JobPosition)
    localStorage.setItem("jobDescription", JobDescription)
    localStorage.setItem("yearsOfExperience", YearsOfExperience)
  }, [JobPosition, JobDescription, YearsOfExperience])

  const triggerVoiceBanner = () => {
    setShowVoiceBanner(true)
    setTimeout(() => setShowVoiceBanner(false), 2500)
  }

  const handleSuggestTitle = async () => {
    if (!JobDescription.trim()) {
      return alert("🚫 Please enter a job description first.")
    }
    setSuggesting(true)
    try {
      const prompt = `Based on this job description, suggest a suitable job title:\n\n${JobDescription}`
      const result = await chatSession.sendMessage(prompt)
      const title = await result.response.text()
      alert("🤖 Suggested Title:\n\n\"" + title.trim() + "\"")
    } catch (error) {
      console.error("Suggest failed:", error)
      alert("❌ AI failed to suggest. Try again later.")
    }
    setSuggesting(false)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (JobDescription.trim().length < 10) {
      alert("📝 Description too brief.")
      return
    }
    setLoading(true)

    const questionCount = process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT
    const InputPrompt = `Job Position: ${JobPosition}, Job Description: ${JobDescription}, Years of Experience: ${YearsOfExperience}. Based on this information, give me ${questionCount} interview questions with answers in JSON format.`;
    const result = await chatSession.sendMessage(InputPrompt)
    const rawText = await result.response.text()
    const  MockjsonResponse = rawText
        .replace(/^```json\s*/i, '')  // remove ```json (case-insensitive)
        .replace(/^```/, '')          // edge case: if there's just ```
        .replace(/```$/, '')          // remove trailing ```
        .trim()

    


    let parsedJson
    try {
      parsedJson = JSON.parse(MockjsonResponse)
    } catch (error) {
      console.error("Failed to parse JSON:", error)
      setLoading(false)
      return
    }

    setJsonResponse(MockjsonResponse)

    const resp = await db.insert(MockInterview).values({
      mockId: uuidv4(),
      jsonMockResp: MockjsonResponse,
      jobPosition: JobPosition,
      jobDesc: JobDescription,
      jobExperience: YearsOfExperience,
      createdBy: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format('DD-MM-YYYY HH:mm:ss')
    }).returning({ mockId: MockInterview.mockId })

    if (resp) {
      localStorage.clear()
      setOpenDialog(false)
      router.push(`/dashboard/interview/${resp[0]?.mockId}`)
    }

    setLoading(false)
  }

  return (
    <TooltipProvider>
      {/* Voice Alert Banner */}
      <AnimatePresence>
        {showVoiceBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-full shadow-lg z-50 text-sm font-semibold flex items-center gap-2"
          >
            <Mic className="w-4 h-4 animate-pulse" />
            Voice Input Coming Soon!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Interview Card */}
      <motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="p-8 rounded-2xl border border-border bg-gradient-to-br from-secondary/30 to-muted shadow-xl cursor-pointer transition-all duration-300 ease-in-out text-center"
  onClick={() => setOpenDialog(true)}
>
  <div className="flex justify-center items-center">
    <PlusCircle className="w-8 h-8 text-primary mb-2 animate-pulse cursor-pointer" />
  </div>

  <h2 className="font-semibold text-xl">Add New Interview</h2>
  <p className="text-sm text-muted-foreground">Generate AI-based mock questions</p>
</motion.div>


      {/* Dialog for form */}
      <Dialog open={OpenDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom duration-500">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-4xl font-extrabold text-primary flex items-center gap-2">
              🧠 AI Interview Generator
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mt-2">
              Enter job details and let AI craft your interview questions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-6 pt-2">
            <div className="relative space-y-2">
              <label className="font-medium flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                Job Position / Role
              </label>
              <Input
                placeholder="Ex. Full Stack Developer"
                value={JobPosition}
                required
                onChange={(e) => setJobPosition(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Job Description
              </label>
              <Textarea
                placeholder="Ex. React, Node.js, APIs..."
                value={JobDescription}
                required
                rows={4}
                className="focus:ring-2 focus:ring-primary transition-all"
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleSuggestTitle}
                  disabled={Suggesting}
                  className="transition hover:shadow-md cursor-pointer"
                >
                  {Suggesting ? (
                    <>
                      <LoaderPinwheel className="mr-2 h-4 w-4 animate-spin" />
                      Suggesting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-1" />
                      Suggest Title
                    </>
                  )}
                </Button>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={triggerVoiceBanner}
                      className="hover:text-primary cursor-pointer transition-all"
                    >
                      <Mic className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  
                </Tooltip>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-medium flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-primary" />
                Years of Experience
              </label>
              <Input
                placeholder="Ex. 3"
                type="number"
                value={YearsOfExperience}
                required
                min="0"
                max="50"
                className="focus:ring-2 focus:ring-primary transition-all"
                onChange={(e) => setYearsOfExperience(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <Button type="button" variant="ghost" className='cursor-pointer' onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={Loading} className="transition hover:shadow-lg cursor-pointer">
                {Loading ? (
                  <>
                    <LoaderPinwheel className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Start Interview'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}

export default AddNewInterview