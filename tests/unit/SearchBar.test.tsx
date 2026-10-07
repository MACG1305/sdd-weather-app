import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SearchBar from '../../src/components/SearchBar';

afterEach(cleanup);

describe('SearchBar', () => {
  it('apresenta regiao de busca e input com label acessivel', () => {
    render(<SearchBar onSearch={vi.fn()} />);

    expect(screen.getByRole('search', { name: 'Buscar cidade' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Cidade' })).toBe(screen.getByLabelText('Cidade'));
  });

  it('envia a cidade por clique removendo apenas espacos das extremidades', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByRole('searchbox'), "  St. John's - Centro  ");
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).toHaveBeenCalledExactlyOnceWith("St. John's - Centro");
  });

  it('envia a cidade por Enter preservando acentos', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.tab();
    expect(screen.getByRole('searchbox')).toHaveFocus();
    await user.keyboard('  S\u00e3o Paulo  {Enter}');

    expect(onSearch).toHaveBeenCalledExactlyOnceWith('S\u00e3o Paulo');
  });

  it.each(['', '   '])('nao busca com input vazio ou so espacos: %j', async (city) => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByRole('searchbox');

    if (city) await user.type(input, city);
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Digite uma cidade.');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Digite uma cidade.');
    expect(input).toHaveFocus();

    await user.type(input, 'Recife');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await user.keyboard('{Enter}');
    expect(onSearch).toHaveBeenCalledExactlyOnceWith('Recife');
  });

  it('desabilita os controles e bloqueia o envio quando disabled e true', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    const { rerender } = render(<SearchBar onSearch={onSearch} />);
    await user.type(screen.getByRole('searchbox'), 'Recife');

    rerender(<SearchBar onSearch={onSearch} disabled />);
    expect(screen.getByRole('searchbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    fireEvent.submit(screen.getByRole('search'));
    expect(onSearch).not.toHaveBeenCalled();

    rerender(<SearchBar onSearch={onSearch} disabled={false} />);
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(onSearch).toHaveBeenCalledExactlyOnceWith('Recife');
  });
});
