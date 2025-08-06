import React, { useState } from 'react';
import {
  DashboardTabs,
  MyNotesList,
  MyCreatedQuizzes,
  AttemptedQuizList,
  MyDoubtsList
} from '../components/ComponentImport';


function Dashboard() {
  const [activeTab, setActiveTab] = useState('notes');

  const renderContent = () => {
    switch (activeTab) {
      case 'notes':
        return <MyNotesList />;
      case 'created':
        return <MyCreatedQuizzes />;
      case 'attempted':
        return <AttemptedQuizList />;
      case 'doubts':
        return <MyDoubtsList />;
      default:
        return <MyNotesList />;
    }
  };

  return (
    <div className='min-h-[calc(100vh-80px)] w-full rounded-2xl bg-black text-white'>
      <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="p-4">{renderContent()}</div>
    </div>
  );
}

export default Dashboard;
