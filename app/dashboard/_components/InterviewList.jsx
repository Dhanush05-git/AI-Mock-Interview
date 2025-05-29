"use client";
import { desc, eq } from 'drizzle-orm';
import { toast } from "sonner"; // Import this at the top

import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import InterviewItemCard from './InterviewItemCard';


function InterviewList() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
 

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);

  const GetInterviewList = async () => {
    const result = await db.select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(MockInterview.id));
    setInterviewList(result);
  };

  const handleDeleteInterview = async (interviewId) => {
    try {
      await db.delete(MockInterview).where(eq(MockInterview.id, interviewId));
      setInterviewList((prev) => prev.filter((item) => item.id !== interviewId));
      toast.success("Interview deleted successfully.");
    } catch (error) {
      console.error("Error deleting interview:", error);
      toast.error("Failed to delete the interview. Please try again.");
    }
  };
  

  return (
    <div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-5">
        {interviewList.map((interview, index) => (
          <InterviewItemCard
            key={interview.id} 
            interview={interview}
            onDelete={handleDeleteInterview}
          />
        ))}
      </div>
    </div>
  );
}

export default InterviewList;
