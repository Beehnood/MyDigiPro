import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import App from './App'
import { api } from './service/Http-service'

vi.mock('./service/Http-service', () => ({
  api: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}))

describe('App', () => {
  it('renders without crashing', async () => {
    localStorage.clear()
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      })
    ) as unknown as typeof fetch

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/movies/genres')
      expect(screen.queryByText(/chargement/i)).not.toBeInTheDocument()
    })

    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
