import ChatPanel from '../components/chat/ChatPanel';
import Desktop from '../components/desktop/Desktop';

const WorkstationPage = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-primary text-text-primary">
      {/* Left Panel: AI Chat */}
      <div className="w-full md:w-1/3 lg:w-1/4 h-full bg-secondary border-r border-border-color flex flex-col">
        <ChatPanel />
      </div>

      {/* Right Panel: Virtual Desktop */}
      <div className="flex-1 h-full">
        <Desktop />
      </div>
    </div>
  );
};

export default WorkstationPage;
