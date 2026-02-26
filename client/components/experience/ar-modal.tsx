import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SketchfabModalViewer from "@/components/experience/viewer";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModelUid: string | null;
}

const ArModal: React.FC<Props> = ({ open, onOpenChange, selectedModelUid }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border m-0 h-screen w-screen p-0 sm:max-w-screen">
        <DialogHeader className="bg-card/90 border-border border-b p-4 backdrop-blur">
          <DialogTitle className="text-foreground font-inter-semibold">
            3D Model Viewer {selectedModelUid ? "- Interactive Experience" : ""}
          </DialogTitle>
        </DialogHeader>
        <div className="h-[calc(100vh-60px)] w-full">
          {selectedModelUid && <SketchfabModalViewer uid={selectedModelUid} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArModal;