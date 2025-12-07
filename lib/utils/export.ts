export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  headers?: Partial<Record<keyof T, string>>,
) {
  if (!data || data.length === 0) {
    return
  }

  // Get keys from first object if headers not provided
  const keys = Object.keys(data[0]) as (keyof T)[]

  // Create CSV header row
  const headerRow = keys.map((key) => headers?.[key] || String(key)).join(',')

  // Create CSV body rows
  const rows = data.map((item) => {
    return keys
      .map((key) => {
        const value = item[key]
        let formattedValue = ''

        // Handle special types
        if (value === null || value === undefined) {
          formattedValue = ''
        } else if (typeof value === 'object') {
          formattedValue = JSON.stringify(value).replace(/"/g, '""') // Escape quotes
        } else if (typeof value === 'string') {
          formattedValue = value.replace(/"/g, '""') // Escape quotes
        } else {
          formattedValue = String(value)
        }

        return `"${formattedValue}"`
      })
      .join(',')
  })

  const csvContent = [headerRow, ...rows].join('\n')

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
