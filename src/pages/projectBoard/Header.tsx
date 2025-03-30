import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Header: React.FC<{ searchTerm: string; setSearchTerm: (term: string) => void; setIsTimelineView: (view: boolean) => void; isTimelineView: boolean }> = ({ searchTerm, setSearchTerm, setIsTimelineView, isTimelineView }) => {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h1 className="text-3xl font-bold text-white">Project Vision Board</h1>
        <p className="text-white/70">Visualize your project's journey with AI assistance</p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative max-w-sm flex-1 md:min-w-[260px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => setIsTimelineView(!isTimelineView)}
          variant="outline" 
          className="bg-white/10 hover:bg-white/20 text-white border-white/20"
        >
          {isTimelineView ? "Board View" : "Timeline View"}
        </Button>
      </div>
    </div>
  );
};

export default Header;