import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createTag } from "@/model/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function TagForm() {
  const [name, setName] = useState<string>();
  const [id, setId] = useState<string>();
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async () => {
    if (!name || !id) return;
    await createTag({ name, id });

    toast({ title: "標籤已建立" });
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-2">
      <label>
        標籤
        <Input
          type="text"
          name="tag-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        標籤ID (英文)
        <Input
          type="text"
          name="tag-id"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
      </label>
      <Button type="button" onClick={onSubmit}>
        新稱標籤
      </Button>
    </div>
  );
}
