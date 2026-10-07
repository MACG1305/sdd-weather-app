import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import UnitToggle from '../../src/components/UnitToggle';
import type { Unit } from '../../src/types/weather';

afterEach(cleanup);

describe('UnitToggle', () => {
  it.each<Unit>(['celsius', 'fahrenheit'])('indica a unidade %s recebida pela prop', (unit) => {
    const onChange = vi.fn();
    render(<UnitToggle unit={unit} onChange={onChange} />);

    expect(screen.getByRole('group', { name: 'Unidade de temperatura' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Celsius/ })).toHaveTextContent('\u00b0C');
    expect(screen.getByRole('button', { name: /Fahrenheit/ })).toHaveTextContent('\u00b0F');
    expect(screen.getByRole('button', { name: /Celsius/ })).toHaveAttribute(
      'aria-pressed',
      String(unit === 'celsius'),
    );
    expect(screen.getByRole('button', { name: /Fahrenheit/ })).toHaveAttribute(
      'aria-pressed',
      String(unit === 'fahrenheit'),
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it('emite a unidade por clique e atualiza o ativo somente ao receber a nova prop', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<UnitToggle unit="celsius" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /Fahrenheit/ }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith('fahrenheit');
    expect(screen.getByRole('button', { name: /Celsius/ })).toHaveAttribute('aria-pressed', 'true');

    rerender(<UnitToggle unit="fahrenheit" onChange={onChange} />);
    expect(screen.getByRole('button', { name: /Fahrenheit/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: /Celsius/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    );

    onChange.mockClear();
    await user.click(screen.getByRole('button', { name: /Celsius/ }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith('celsius');
  });

  it.each(['{Enter}', ' '])('permite navegar por Tab e ativar com %j', async (key) => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<UnitToggle unit="celsius" onChange={onChange} />);

    await user.tab();
    expect(screen.getByRole('button', { name: /Celsius/ })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: /Fahrenheit/ })).toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();
    await user.keyboard(key);
    expect(onChange).toHaveBeenCalledExactlyOnceWith('fahrenheit');

    onChange.mockClear();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: /Celsius/ })).toHaveFocus();
    await user.keyboard(key);
    expect(onChange).toHaveBeenCalledExactlyOnceWith('celsius');
  });

  it('nao envia um formulario pai ao selecionar uma unidade', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <UnitToggle unit="celsius" onChange={vi.fn()} />
      </form>,
    );

    await user.click(screen.getByRole('button', { name: /Fahrenheit/ }));
    await user.keyboard('{Enter}');
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
