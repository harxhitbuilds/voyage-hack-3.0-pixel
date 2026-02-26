"use client";

import { X } from "lucide-react";

import React from "react";

import SketchfabModalViewer from "@/components/experience/viewer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModelUid: string | null;
}

const ArModal: React.FC<Props> = ({ open, onOpenChange, selectedModelUid }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="m-0 h-screen w-screen max-w-none border-0 bg-black p-0">
        <DialogHeader className="absolute top-0 left-0 z-50 flex w-full flex-row items-center justify-between border-b border-zinc-800 bg-black/80 px-6 py-4 backdrop-blur-md">
          <DialogTitle className="text-sm font-semibold text-white">
            3D Model Viewer
            {selectedModelUid && (
              <span className="ml-2 text-xs font-normal text-zinc-500">
                — Interactive Experience
              </span>
            )}
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-all hover:border-zinc-600 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        <div className="h-full w-full pt-14">
          {selectedModelUid && <SketchfabModalViewer uid={selectedModelUid} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArModal;
