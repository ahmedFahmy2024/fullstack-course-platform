"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema, CourseSchemaType } from "../schemas/courses";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import RequiredLabelIcon from "@/components/RequiredLabelIcon";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { createCourse } from "../actions/courses";

const CourseForm = () => {
  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(values: CourseSchemaType) {
    const data = createCourse(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Title
                <RequiredLabelIcon />
              </FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description
                <RequiredLabelIcon />
              </FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-20 resize-none"
                  placeholder="Description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="self-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CourseForm;
