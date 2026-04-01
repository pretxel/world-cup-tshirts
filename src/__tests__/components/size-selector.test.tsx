import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SizeSelector } from '@/components/size-selector'

describe('SizeSelector', () => {
  it('renders all sizes', () => {
    const onChange = vi.fn()
    render(
      <SizeSelector
        sizes={['S', 'M', 'L', 'XL', 'XXL']}
        selected="M"
        onChange={onChange}
      />
    )
    expect(screen.getByText('S')).toBeInTheDocument()
    expect(screen.getByText('M')).toBeInTheDocument()
    expect(screen.getByText('XXL')).toBeInTheDocument()
  })

  it('marks selected size visually', () => {
    const onChange = vi.fn()
    render(
      <SizeSelector
        sizes={['S', 'M', 'L']}
        selected="M"
        onChange={onChange}
      />
    )
    const mButton = screen.getByText('M').closest('button')
    expect(mButton).toHaveClass('bg-foreground')
  })

  it('calls onChange when a size is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <SizeSelector
        sizes={['S', 'M', 'L']}
        selected="M"
        onChange={onChange}
      />
    )
    await user.click(screen.getByText('L'))
    expect(onChange).toHaveBeenCalledWith('L')
  })
})
