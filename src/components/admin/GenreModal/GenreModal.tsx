"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { AdminGenre } from "@/apis/admin.api";
import { useToast } from "@/contexts/toast.context";

interface Props {
  open: boolean;
  onClose: () => void;
  genre: AdminGenre | null;
  onSave: (names: AdminGenre["names"]) => Promise<void>;
}

export function GenreModal({ open, onClose, genre, onSave }: Props) {
  const toast = useToast();
  const [names, setNames] = React.useState<AdminGenre["names"]>(
    genre?.names || [{ iso_639_1: "en", name: "" }]
  );

  const handleChange = (index: number, field: "iso_639_1" | "name", value: string) => {
    setNames((prev) =>
      prev.map((n, i) => (i === index ? { ...n, [field]: value } : n))
    );
  };

  const addLang = () => {
    setNames((prev) => [...prev, { iso_639_1: "", name: "" }]);
  };

  const removeLang = (index: number) => {
    setNames((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (names.some((n) => !n.iso_639_1 || !n.name)) {
      toast.error("Please fill all language fields");
      return;
    }
    await onSave(names);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{genre ? "Edit Genre" : "Create Genre"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          {names.map((n, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input
                value={n.iso_639_1}
                onChange={(e) => handleChange(i, "iso_639_1", e.target.value)}
                placeholder="Language code (en, vi...)"
                className="w-24"
              />
              <Input
                value={n.name}
                onChange={(e) => handleChange(i, "name", e.target.value)}
                placeholder="Genre name"
                className="flex-1"
              />
              <button type="button" onClick={() => removeLang(i)}>
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addLang}
            className="flex items-center gap-1 text-blue-400 text-sm"
          >
            <Plus size={14} /> Add language
          </button>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
