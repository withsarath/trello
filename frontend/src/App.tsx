import { useEffect, useState } from "react"
import axios from "axios"

export default function App() {
  const [status, setStatus] = useState<string | null>(null)

  useEffect(()=>{
    axios.get("http://localhost:5000/api/health").then((response)=>{
      setStatus(response.data.status)
    })
  },[])
  return (
    <div>
      <p>API Status: {status ?? "down"}</p>
    </div>
  )
}
