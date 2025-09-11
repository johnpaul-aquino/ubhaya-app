import { render, screen, userEvent, testA11y } from '@/lib/test-utils';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    
    expect(screen.getByRole('button')).toHaveClass('bg-secondary');
    
    rerender(<Button variant="destructive">Destructive</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');
  });

  it('applies size styles correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    
    expect(screen.getByRole('button')).toHaveClass('h-9');
    
    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-11');
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveClass('disabled:pointer-events-none');
  });

  it('supports loading state', () => {
    render(<Button loading>Loading</Button>);
    
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('renders as link when href is provided', () => {
    render(<Button href="/test">Link Button</Button>);
    
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('meets accessibility standards', async () => {
    await testA11y(<Button>Accessible Button</Button>);
  });

  it('supports custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Button with ref</Button>);
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});