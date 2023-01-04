const server = Bun.spawn({
    cmd: ['bun', 'run', '--hot', 'src/index.ts'],
    stdout: 'pipe',
    cwd: 'server'
})

Bun.spawn({
    cmd: ['npx', 'vite'],
    stdout: 'pipe',
    cwd: 'client'
})

console.log('Server running at http://localhost:3000')
console.log('Client running at http://localhost:5173')
