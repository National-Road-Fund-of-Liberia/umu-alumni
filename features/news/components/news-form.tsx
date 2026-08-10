"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { FieldWrapper } from "@/components/common/form/field-wrapper";
import { ImageUpload } from "@/components/common/form/image-upload";
import { SubmitButton } from "@/components/common/form/submit-button";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { newsApi } from "@/features/news/api";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";
import { ResourceApiError } from "@/lib/resource-client";
import { newsSchema, type NewsFormValues } from "@/schemas/news";
import { NEWS_CATEGORIES, NEWS_STATUSES, type NewsArticle } from "@/types/news";

interface NewsFormProps {
  article?: NewsArticle;
}

const EMPTY_DEFAULTS: NewsFormValues = {
  title: "",
  excerpt: "",
  content: "",
  coverImageUrl: null,
  category: NEWS_CATEGORIES[0],
  status: "draft",
  author: "",
  publishedAt: null,
};

function toDateInputValue(iso: string | null): string {
  return iso ? iso.slice(0, 10) : "";
}

export function NewsForm({ article }: NewsFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setError,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: article ?? EMPTY_DEFAULTS,
  });

  const { navigate } = useUnsavedChangesGuard(isDirty);
  const status = watch("status");

  async function onSubmit(values: NewsFormValues) {
    try {
      if (article) {
        await newsApi.update(article.id, values);
        toast.success("Article updated.");
      } else {
        await newsApi.create(values);
        toast.success("Article created.");
      }
      router.push("/admin/news");
      router.refresh();
    } catch (error) {
      if (error instanceof ResourceApiError && error.fieldErrors) {
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          if (messages[0]) setError(field as keyof NewsFormValues, { message: messages[0] });
        }
      }
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-3xl space-y-8">
      <FieldGroup>
        <Controller
          control={control}
          name="coverImageUrl"
          render={({ field }) => (
            <ImageUpload
              label="Cover image"
              folder="news"
              aspect="video"
              value={field.value}
              onChange={field.onChange}
              error={errors.coverImageUrl?.message}
            />
          )}
        />

        <FieldWrapper label="Title" htmlFor="title" error={errors.title} required>
          <Input id="title" aria-invalid={!!errors.title} {...register("title")} />
        </FieldWrapper>

        <FieldWrapper
          label="Excerpt"
          htmlFor="excerpt"
          error={errors.excerpt}
          required
          description="A short summary shown in article cards and previews."
        >
          <Textarea id="excerpt" rows={2} aria-invalid={!!errors.excerpt} {...register("excerpt")} />
        </FieldWrapper>

        <FieldWrapper label="Content" htmlFor="content" error={errors.content} required>
          <Textarea id="content" rows={10} aria-invalid={!!errors.content} {...register("content")} />
        </FieldWrapper>

        <div className="grid gap-5 sm:grid-cols-2">
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <FieldWrapper label="Category" htmlFor="category" error={errors.category} required>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="category" aria-invalid={!!errors.category}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NEWS_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldWrapper>
            )}
          />
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <FieldWrapper label="Status" htmlFor="status" error={errors.status} required>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="status" aria-invalid={!!errors.status}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NEWS_STATUSES.map((statusOption) => (
                      <SelectItem key={statusOption} value={statusOption}>
                        {statusOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldWrapper>
            )}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FieldWrapper label="Author" htmlFor="author" error={errors.author} required>
            <Input id="author" aria-invalid={!!errors.author} {...register("author")} />
          </FieldWrapper>
          <Controller
            control={control}
            name="publishedAt"
            render={({ field }) => (
              <FieldWrapper
                label="Publish date"
                htmlFor="publishedAt"
                error={errors.publishedAt}
                description={status === "draft" ? "Optional while the article is a draft." : undefined}
              >
                <Input
                  id="publishedAt"
                  type="date"
                  value={toDateInputValue(field.value)}
                  onChange={(event) =>
                    field.onChange(event.target.value ? new Date(event.target.value).toISOString() : null)
                  }
                />
              </FieldWrapper>
            )}
          />
        </div>
      </FieldGroup>

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <SubmitButton isSubmitting={isSubmitting} submittingLabel="Saving…">
          {article ? "Save Changes" : "Create Article"}
        </SubmitButton>
        <Button type="button" variant="outline" onClick={() => navigate("/admin/news")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
