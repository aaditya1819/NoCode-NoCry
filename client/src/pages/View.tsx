import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import ProjectPreview from "../components/ProjectPreview"
import type { Project } from "../types"
import api from "@/configs/axios"
import { toast } from "sonner"

const View = () => {
  const { projectId } = useParams()
  const [code, setCode] = useState<string>('')
  const [loading, setLoading] = useState(true)

  const fetchPublishedCode = async () => {
    try {
      const { data } = await api.get(`/api/project/published/${projectId}`)
      setCode(data.code)
      setLoading(false)
    } catch (error: any) {
      console.error("Error fetching published site:", error);
      const msg = error?.response?.data?.message || "This site is not published or doesn't exist.";
      toast.error(msg)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPublishedCode()
  }, [projectId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <Loader2 className="size-10 animate-spin text-indigo-500" />
      </div>
    )
  }

  if (!code) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950 text-white text-center p-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">404 - Not Found</h1>
          <p className="text-gray-400">This website is either private or does not exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white">
      <ProjectPreview
        project={{ current_code: code } as Project}
        isGenerating={false}
        showEditorPanel={false}
      />
    </div>
  )
}

export default View
