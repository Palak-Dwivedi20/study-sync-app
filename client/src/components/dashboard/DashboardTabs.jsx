import { Button } from '../ComponentImport';
const tabs = [
    { key: 'notes', label: 'My Notes' },
    { key: 'created', label: 'Created Quizzes' },
    { key: 'attempted', label: 'Attempted Quizzes' },
    { key: 'doubts', label: 'My Doubts' },
];

function DashboardTabs({ activeTab, setActiveTab }) {
    return (
        <div className="bg-black text-white shadow-sm py-4 mt-4 flex justify-evenly gap-4 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
                <Button
                    key={tab.key}
                    title={tab.label}
                    onClick={() => setActiveTab(tab.key)}
                    className={`text-sm font-medium px-4 py-2 rounded-full transition 
                            ${activeTab === tab.key
                            ? 'bg-white text-black'
                            : 'bg-zinc-800 hover:bg-zinc-900'}
                    `}
                />
            ))}
        </div>
    );
}

export default DashboardTabs;
