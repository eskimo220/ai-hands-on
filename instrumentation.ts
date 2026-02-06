export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { ProxyAgent, setGlobalDispatcher } = await import('undici');
    
    // 设置指向你的 7890 端口
    const proxyAgent = new ProxyAgent('http://127.0.0.1:7890');
    setGlobalDispatcher(proxyAgent);
    
    console.log('✅ Next.js 全局代理已挂载至 7890');
  }
}