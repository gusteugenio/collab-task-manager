const tailwindColors = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-indigo-500',
  'bg-cyan-500',
  'bg-orange-500'
]

export function getCategoryColor(name: string) {
  // Gera um número baseado na soma dos caracteres do nome
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  // Pega o índice dentro da lista de cores
  const index = Math.abs(hash) % tailwindColors.length
  return tailwindColors[index]
}
