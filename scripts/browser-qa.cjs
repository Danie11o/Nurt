const { chromium } = require('C:/Users/daniel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const out = path.resolve('artifacts');
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(8000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:5174/', { waitUntil: 'networkidle' });
  await assert.doesNotReject(() => page.getByText('NURT C2', { exact: true }).waitFor());
  assert.match(await page.locator('body').innerText(), /DANE SYNTETYCZNE/);
  await page.screenshot({ path: path.join(out, 'nurt-c2-focus-mode.png'), fullPage: true });
  assert.equal(await page.getByRole('button', { name: 'Satelita', exact: true }).count(), 0);
  assert.equal(await page.getByRole('button', { name: 'Uliczna', exact: true }).count(), 0);

  await page.getByRole('button', { name: 'Narzędzia', exact: true }).click();
  await page.getByText('Reset scenariusza', { exact: true }).waitFor();
  await page.screenshot({ path: path.join(out, 'nurt-c2-tools-menu.png'), fullPage: true });
  await page.getByRole('button', { name: 'Analiza danych', exact: true }).click();
  await page.getByText('SYMULOWANY POTOK ANALITYCZNY', { exact: true }).waitFor();
  await page.screenshot({ path: path.join(out, 'nurt-c2-analysis-modal.png'), fullPage: true });
  await page.locator('div.fixed.inset-0').getByRole('button').nth(1).click();

  await page.getByRole('button', { name: /Otwórz: Misja i zasoby/ }).click();
  await page.getByText('MISJA DRONOWA', { exact: true }).waitFor();
  await page.getByRole('button', { name: /Zamknij: Misja i zasoby/ }).click();

  await page.getByRole('button', { name: /Otwórz: Priorytety/ }).click();
  await page.getByText('Priorytety Operacyjne', { exact: true }).waitFor();
  await page.getByRole('button', { name: /Zamknij: Priorytety/ }).click();

  await page.getByRole('button', { name: /Otwórz: Zmiany od lotu/ }).click();
  await page.getByText('CHANGES SINCE LAST FLIGHT', { exact: true }).waitFor();
  await page.getByRole('button', { name: /Zamknij: Zmiany od lotu/ }).click();

  await page.getByRole('button', { name: /DEMO Z PRZEWODNIKIEM/ }).click();
  await page.getByText(/KROK 1\/8/).first().waitFor();
  await page.waitForTimeout(4500);
  await page.getByText(/KROK 1\/8/).first().waitFor();
  assert.match(await page.locator('body').innerText(), /Co pojawiło się na mapie/i);
  await page.screenshot({ path: path.join(out, 'nurt-c2-demo-guide-manual.png'), fullPage: true });
  for (let i = 0; i < 7; i += 1) {
    await page.getByRole('button', { name: /NEXT STEP/ }).click();
  }
  await page.getByText('LOT-02 zamyka pętlę', { exact: true }).first().waitFor();
  assert.match(await page.locator('body').innerText(), /LOT-02 potwierdza, że blokada nadal trwa/);
  await page.getByRole('button', { name: 'Krytyczny alert' }).click();
  await page.getByText(/Inspektor Obiektu Mapowego/).waitFor();
  assert.deepEqual(errors, []);
  await page.screenshot({ path: path.join(out, 'nurt-c2-final.png'), fullPage: true });
  await page.getByRole('button', { name: /ZAKOŃCZ DEMO/ }).click();
  await page.getByRole('button', { name: 'START DEMO', exact: true }).waitFor();
  assert.match(await page.locator('body').innerText(), /12:45/);
  console.log(JSON.stringify({ passed: true, step: 8, errors, screenshot: path.join(out, 'nurt-c2-final.png') }, null, 2));
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
