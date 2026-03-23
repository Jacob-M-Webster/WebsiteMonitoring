import { createClient } from '@supabase/supabase-js'

interface Env {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
}

async function pingURL(url: string) {
  try {
    const start_time = Date.now()
    const response = await fetch(url)
    const latency = start_time - Date.now()
    const status_code = response.status

    if (status_code >= 200 && status_code < 300) {
      if (latency >= 150) {
        return {status: "up with high latency", latency: latency}
      } else {
        return {status: "up", latency: latency}
      }

    } else if (status_code >= 400 && status_code < 600){
      return {status: "down", latency: latency}
    }
  } catch (error) {
    return { status: 'down', latency: 0 }
  }
}

async function runChecks(supabase: any) {
  const { data, error } = await supabase.rpc('check_intervals')
  
  if (error || !data) {
    return
  }

  for (const monitor of data) {
    const result = pingURL(monitor.url)

    

  }
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
    ctx.waitUntil(runChecks(supabase))
  }
}