import randomColor from 'randomcolor'

export function stringToColor(str: string): string {
  return randomColor({
    luminosity: 'dark',
    seed: str,
  })
}
