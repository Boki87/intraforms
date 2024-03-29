"use client";

import { updatePage } from "@/app/actions/pages";
import { FormFields } from "@/components/FormFields/Field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounceEffect } from "@/hooks/useDebounceEffect";
import useEditForm from "@/hooks/useEditForm";
import { useEffect, useMemo, useRef, useState } from "react";

const PageEditSidebar: React.FC = () => {
  const editForm = useEditForm();
  const { activeField, setActiveField } = editForm;

  const activePage = editForm.pages.find(
    (page) => page.id === editForm.activePage,
  );

  const previousActivePage = useRef(activePage);

  const [title, setTitle] = useState("");

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const FieldProperites = activeField
    ? FormFields[activeField.type].propertiesComponent
    : null;

  useDebounceEffect(
    async () => {
      if (!activePage) return;
      await updatePage(activePage.id, { title });
      editForm.setPages(
        editForm.pages.map((page) => {
          if (page.id === activePage.id) {
            return {
              ...page,
              title,
            };
          }
          return page;
        }),
      );
    },
    1500,
    [title],
  );

  useEffect(() => {
    setTitle(activePage?.title || "");
  }, [activePage?.title]);

  useEffect(() => {
    setActiveField(null);
  }, [activePage?.id]);

  return (
    <div>
      <div className="p-5 border-b border-gray-200 bg-gray-100">
        <Label className="gap-2">
          <span>Page Title:</span>
          <Input
            value={title}
            onChange={onTitleChange}
            placeholder="Page Name"
          />
        </Label>
      </div>
      <div>
        {activeField && FieldProperites && (
          <FieldProperites fieldInstance={activeField} />
        )}
      </div>
    </div>
  );
};

export default PageEditSidebar;
