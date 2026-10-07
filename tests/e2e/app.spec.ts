import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('layout mockado, busca e conversao de temperaturas', async ({ page }, testInfo) => {
  const errors: string[] = [];
  const apiRequests: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (request.url().includes('open-meteo.com')) apiRequests.push(request.url());
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Weather App' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Nenhuma cidade selecionada' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('idle.png'), fullPage: true });

  await page.getByRole('searchbox', { name: 'Cidade' }).fill('Sao Paulo');
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Carregando previs\u00e3o...');
  await expect(page.getByRole('heading', { name: 'S\u00e3o Paulo', exact: true })).toBeVisible();
  await expect(page.getByText('22 \u00b0C', { exact: true })).toBeVisible();

  const forecast = page.getByRole('region', { name: 'Previs\u00e3o de 5 dias' });
  await expect(forecast.getByRole('listitem')).toHaveCount(5);
  await page.getByRole('button', { name: /Fahrenheit/ }).click();
  await expect(page.getByText('72 \u00b0F', { exact: true })).toBeVisible();
  await expect(forecast.getByText('61 \u00b0F', { exact: true })).toBeVisible();
  await expect(page.getByText('12,6 km/h', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /Fahrenheit/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  const layout = await page.evaluate(() => {
    const controls = [...document.querySelectorAll('header input, header button')].map(
      (element) => {
        const bounds = element.getBoundingClientRect();
        return { left: bounds.left, top: bounds.top, right: bounds.right, bottom: bounds.bottom };
      },
    );
    const overlap = controls.some((first, index) =>
      controls
        .slice(index + 1)
        .some(
          (second) =>
            first.left < second.right &&
            first.right > second.left &&
            first.top < second.bottom &&
            first.bottom > second.top,
        ),
    );
    return {
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      overlap,
      icons: document.querySelectorAll('main svg').length,
    };
  });
  expect(layout.overflow).toBe(false);
  expect(layout.overlap).toBe(false);
  expect(layout.icons).toBe(6);
  await page.screenshot({ path: testInfo.outputPath('success-fahrenheit.png'), fullPage: true });
  expect(errors).toEqual([]);
  expect(apiRequests).toEqual([]);
});

test('alternancia dos estados e retry sem dados antigos', async ({ page }) => {
  await page.goto('/');
  const state = page.getByRole('combobox', { name: 'Estado da consulta' });

  await state.selectOption('success');
  await expect(page.getByRole('region', { name: 'Previs\u00e3o de 5 dias' })).toBeVisible();
  await state.selectOption('error');
  await expect(page.getByRole('alert')).toContainText('N\u00e3o foi poss\u00edvel carregar');
  await expect(page.getByRole('list')).toHaveCount(0);
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(state).toHaveValue('loading');
  await expect(page.getByRole('heading', { name: 'S\u00e3o Paulo', exact: true })).toBeVisible();

  await page.getByRole('searchbox').fill('Manaus');
  await page.getByRole('searchbox').press('Enter');
  await expect(page.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeVisible();
  await expect(page.getByRole('list')).toHaveCount(0);
  await expect(page.getByRole('searchbox')).toHaveValue('Manaus');

  await state.selectOption('loading');
  await expect(page.getByRole('status')).toContainText('Carregando previs\u00e3o...');
  await state.selectOption('idle');
  await expect(page.getByRole('heading', { name: 'Nenhuma cidade selecionada' })).toBeVisible();
});

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`acessibilidade e responsividade em ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const state = page.getByRole('combobox', { name: 'Estado da consulta' });

    for (const status of ['idle', 'empty', 'error', 'success']) {
      await state.selectOption(status);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations, `${status}: ${JSON.stringify(results.violations)}`).toEqual([]);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
    }

    await expect(page.getByRole('listitem')).toHaveCount(5);
    await page.screenshot({ path: testInfo.outputPath(`success-${width}.png`), fullPage: true });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await state.selectOption('loading');
    const spinner = page.getByRole('status').locator('svg');
    await expect(spinner).toHaveCSS('animation-name', 'none');
  });
}

test('ordem de teclado, validacao e foco apos retry', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Ir para o conte\u00fado' });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await expect(page.getByRole('main')).toHaveCSS('outline-style', 'solid');

  await page.goto('/?keyboard=1');
  await expect(page.getByRole('heading', { name: 'Weather App' })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(skipLink).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /Celsius/ })).toBeFocused();
  await expect(page.getByRole('button', { name: /Celsius/ })).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /Fahrenheit/ })).toBeFocused();
  await page.keyboard.press('Tab');
  const input = page.getByRole('searchbox', { name: 'Cidade' });
  await expect(input).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Buscar', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(input).toBeFocused();
  await expect(input).toHaveAttribute('aria-invalid', 'true');

  await page.getByRole('combobox').selectOption('error');
  await page.getByRole('button', { name: 'Tentar novamente' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await expect(page.getByText('Dados de exemplo de S\u00e3o Paulo carregados.')).toBeAttached();
});

test('reflow com texto ampliado a 200% em 320px', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Weather App' })).toBeVisible();
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  await page.getByRole('combobox').selectOption('success');
  await expect(page.getByRole('listitem')).toHaveCount(5);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: testInfo.outputPath('text-200-percent.png'), fullPage: true });
});
