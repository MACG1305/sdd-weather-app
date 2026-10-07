import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import EmptyState from '../../src/components/states/EmptyState';
import ErrorState from '../../src/components/states/ErrorState';
import LoadingState from '../../src/components/states/LoadingState';

afterEach(cleanup);

describe('LoadingState', () => {
  it('anuncia carregamento com role status', () => {
    render(<LoadingState />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando...');
    expect(screen.getByRole('status')).toHaveAttribute('aria-atomic', 'true');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('permite distinguir o carregamento de busca e clima pela mensagem', () => {
    const { rerender } = render(<LoadingState message="Buscando cidades..." />);
    expect(screen.getByRole('status')).toHaveTextContent('Buscando cidades...');

    rerender(<LoadingState message="Carregando previsao..." />);
    expect(screen.getByRole('status')).toHaveTextContent('Carregando previsao...');
  });
});

describe('ErrorState', () => {
  it('anuncia a mensagem recebida sem disparar retry automaticamente', () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Nao foi possivel buscar cidades." onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Nao foi possivel buscar cidades.');
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument();
    expect(onRetry).not.toHaveBeenCalled();
    expect(screen.queryByText('Nenhuma cidade encontrada')).not.toBeInTheDocument();
  });

  it('chama somente o callback recebido uma vez por clique', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState message="Previsao indisponivel." onRetry={onRetry} />);

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledWith();
  });

  it.each(['{Enter}', ' '])('permite retry por teclado com %j', async (key) => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState message="Previsao indisponivel." onRetry={onRetry} />);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toHaveFocus();
    expect(onRetry).not.toHaveBeenCalled();
    await user.keyboard(key);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('nao envia um formulario pai ao repetir', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event) => event.preventDefault());
    const onRetry = vi.fn();
    render(
      <form onSubmit={onSubmit}>
        <ErrorState message="Previsao indisponivel." onRetry={onRetry} />
      </form>,
    );

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe('EmptyState', () => {
  it('apresenta titulo e dica para uma busca sem resultados, sem mensagem de erro', () => {
    render(<EmptyState />);

    expect(screen.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Confira a grafia ou adicione a regi\u00e3o ou o pa\u00eds na busca.',
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('permite personalizar o titulo e a dica', () => {
    render(<EmptyState title="Busque uma cidade" hint="Informe o nome da cidade." />);

    expect(screen.getByRole('heading', { name: 'Busque uma cidade' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Informe o nome da cidade.');
  });
});
