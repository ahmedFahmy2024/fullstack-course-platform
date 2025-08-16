import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CoursePage = () => {
  return (
    <div className="container my-6">
      <PageHeader title="Courses">
        <Button asChild>
          <Link href="/admin/courses/new">New Course</Link>
        </Button>
      </PageHeader>

      <div>content</div>
    </div>
  );
};

export default CoursePage;
