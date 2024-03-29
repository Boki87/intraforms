import { fetchFormByUuid } from "@/app/actions/forms";
import { fetchPages } from "@/app/actions/pages";
import FormEditProvider from "@/providers/FormEditProvider";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import EditLayout from "./components/Layout";

export default async function EditFormPage({
  params,
}: {
  params: { formId: string };
}) {
  const { formId } = params;
  const user = await currentUser();
  if (!user) redirect("/");

  const form = await fetchFormByUuid(formId);
  if (!form) redirect("/dashboard");

  if (form.userId !== user.id) redirect("/dashboard");

  const pages = await fetchPages(user.id, form?.id);

  return (
    <FormEditProvider pages={pages}>
      <EditLayout userId={user.id} formId={form.id} />
    </FormEditProvider>
  );
}
