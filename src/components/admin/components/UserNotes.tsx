import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { AdminNote } from "../types";
import { useState } from "react";

interface UserNotesProps {
  userName: string;
  notes: AdminNote[];
  onAddNote: (note: string) => Promise<void>;
}

export const UserNotes = ({ userName, notes, onAddNote }: UserNotesProps) => {
  const [noteContent, setNoteContent] = useState("");

  const handleSubmit = async () => {
    if (!noteContent.trim()) return;
    await onAddNote(noteContent);
    setNoteContent("");
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Notas Administrativas - {userName}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          {notes?.map((note) => (
            <div key={note.id} className="p-2 border rounded">
              <p className="text-sm">{note.note}</p>
              <p className="text-xs text-gray-500">
                {format(new Date(note.created_at), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Textarea
            placeholder="Adicionar nova nota..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
          />
          <Button 
            onClick={handleSubmit}
            disabled={!noteContent.trim()}
          >
            Adicionar Nota
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};