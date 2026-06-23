import { expect, test } from '@playwright/test'

test('dashboard supports search and project selection', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'trekoms' }).first()).toBeVisible()

  await page.getByPlaceholder('搜索项目、别名、GitLab、测试服务器...').fill('shipchemical')
  await expect(page.getByRole('heading', { name: 'shipchemical_api' })).toBeVisible()

  await page.getByRole('button', { name: /shipchemical_api/ }).click()
  await expect(page.getByRole('button', { name: /编辑项目/ })).toBeVisible()
})

test('dashboard creates, edits and deletes a project through the API', async ({ page }) => {
  const suffix = Date.now()
  const projectName = `CRUD 验证项目 ${suffix}`
  const editedRemark = `已通过真实接口更新 ${suffix}`

  await page.goto('/')
  await page.getByRole('button', { name: /新建项目|\+/ }).click()
  await page.getByLabel('项目名称').fill(projectName)
  await page.getByLabel('别名').fill('CRUD 验证别名')
  await page.getByLabel('GitLab地址').fill(`http://git.example.com/crud-${suffix}.git`)
  await page.getByLabel('开发').fill('测试人员')
  await page.getByLabel('测试服务器').fill('192.168.99.10(N2)')
  await page.getByLabel('测试环境').fill(`http://test.example.com/${suffix}`)
  await page.getByLabel('生产环境').fill(`https://prod.example.com/${suffix}`)
  await page.getByLabel('备注').fill('真实 CRUD 创建验证')
  await page.getByRole('button', { name: '创建项目' }).click()

  await expect(page.getByRole('heading', { name: projectName })).toBeVisible()

  await page.getByRole('button', { name: new RegExp(projectName) }).click()
  await page.getByRole('button', { name: '编辑项目' }).click()
  await page.getByLabel('备注').fill(editedRemark)
  await page.getByRole('button', { name: '保存修改' }).click()
  await expect(page.getByText(editedRemark)).toBeVisible()

  page.once('dialog', async (dialog) => {
    await dialog.accept()
  })
  await page.getByRole('button', { name: '删除项目' }).click()
  await expect(page.getByRole('heading', { name: projectName })).toHaveCount(0)
})
