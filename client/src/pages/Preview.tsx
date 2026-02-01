import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import ProjectPreview from "../components/ProjectPreview"
import type { Project } from "../types"
import api from "@/configs/axios"
import { toast } from "sonner"

const Preview = () => {
  const { projectId, versionId } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProjectPreview = async () => {
    try {
      const { data } = await api.get(`/api/project/preview/${projectId}`)

      let currentProject = data.project;

      // If a specific versionId is provided, we use that version's code
      if (versionId && currentProject.versions) {
        const version = currentProject.versions.find((v: any) => v.id === versionId);
        if (version) {
          currentProject = {
            ...currentProject,
            current_code: version.code
          }
        }
      }

      setProject(currentProject)
      setLoading(false)
    } catch (error: any) {
      console.error("Error fetching preview:", error);
      toast.error(error?.response?.data?.message || "Failed to load preview")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjectPreview()
  }, [projectId, versionId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-10 animate-spin text-indigo-500" />
          <p className="text-gray-400 font-medium">Loading your preview...</p>
        </div>
      </div>
    )
  }

  if (!project || !project.current_code) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950 text-white">
        <p className="text-xl font-medium">Project not found or no code generated yet.</p>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-950">
      <ProjectPreview
        project={project}
        isGenerating={false}
        showEditorPanel={false}
      />
    </div>
  )
}

export default Preview
