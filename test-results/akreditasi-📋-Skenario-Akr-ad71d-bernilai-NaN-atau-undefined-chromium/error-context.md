# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: akreditasi.spec.ts >> 📋 Skenario Akreditasi (Skenario 5) >> Integritas Data Akreditasi - Validasi Angka >> Angka statistik pada dashboard tidak bernilai NaN atau undefined
- Location: e2e\akreditasi.spec.ts:232:9

# Error details

```
Error: expect(received).not.toMatch(expected)

Expected pattern: not /\bundefined\b/
Received string:      "Portal DataPrestasiS1 Teknik IndustriDashboard AkreditasiRekap 5 TahunLogoutToggle Sidebarakreditasi testakreditasi.test@telkomuniversity.ac.idDashboard AkreditasiAnalitik prestasi mahasiswa untuk LAM TEKNIKExport ExcelFilter Data & Rentang WaktuTahun Sasaran (TS)2026Rentang (Untuk Indikator)5KategoriSemua KategoriLevelSemua LevelProgram StudiTeknik IndustriIndikator Akreditasi (LAM TEKNIK)NM(TS) Belum DiaturPrestasi Internasional (RI)1(0.00%) / 0.2% targetPrestasi Nasional (RN)0(0.00%) / 2% targetPrestasi Wilayah/Lokal (RW)0(0.00%) / 4% targetTren Prestasi 5 Tahun (Berdasarkan TS)
 [data-chart=chart-_R_a9bn5ritqkndlb_] {
  --color-int: #50c878;
  --color-nas: #22c55e;
  --color-wil: #86efac;
}


.dark [data-chart=chart-_R_a9bn5ritqkndlb_] {
  --color-int: #50c878;
  --color-nas: #22c55e;
  --color-wil: #86efac;
}
2022202320242025202600.250.50.751Summary Prestasi 5 TahunMatriks rekapitulasi data prestasi mahasiswaTahunKategoriInternasionalNasionalWilayah/LokalTotal2026Akademik00002026Non-Akademik00002025Akademik00002025Non-Akademik00002024Akademik00002024Non-Akademik00002023Akademik00002023Non-Akademik00002022Akademik10012022Non-Akademik0000self.__next_r=\"pR0ZhpyhKdVvTBoYU2lUl\"(self.__next_f=self.__next_f||[]).push([0])self.__next_f.push([1,\"a:I[\\\"[project]/node_modules/next/dist/next-devtools/userspace/app/segment-explorer-node.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_0m5k-~q._.js\\\",\\\"/_next/static/chunks/src_0kuf-7q._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\"],\\\"SegmentViewNode\\\"]\\nc:\\\"$Sreact.fragment\\\"\\n20:I[\\\"[project]/src/components/ui/tooltip.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_0m5k-~q._.js\\\",\\\"/_next/static/chunks/src_0kuf-7q._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\"],\\\"TooltipProvider\\\"]\\n22:I[\\\"[project]/node_modules/next/dist/client/components/layout-router.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_0m5k-~q._.js\\\",\\\"/_next/static/chunks/src_0kuf-7q._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\"],\\\"default\\\"]\\n24:I[\\\"[project]/node_modules/next/dist/client/components/render-from-template-context.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_0m5k-~q._.js\\\",\\\"/_next/static/chunks/src_0kuf-7q._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\"],\\\"default\\\"]\\n36:I[\\\"[project]/src/components/ui/sonner.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_0m5k-~q._.js\\\",\\\"/_next/static/chunks/src_0kuf-7q._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\"],\\\"Toaster\\\"]\\n4f:I[\\\"[project]/node_modules/next/dist/client/components/client-page.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_0m5k-~q._.js\\\",\\\"/_next/static/chunks/src_0kuf-7q._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\"],\\\"ClientPageRoot\\\"]\\n50:I[\\\"[project]/src/app/(akreditasi)/akreditasi/dashboard/page.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_0m5k-~q._.js\\\",\\\"/_next/static/chunks/src_0kuf-7q._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/src_08gfu~r._.js\\\",\\\"/_next/static/chunks/node_modules_%40base-ui_react_esm_0~mp6fp._.js\\\",\\\"/_next/static/chunks/node_modules_06wt_rj._.js\\\",\\\"/_next/static/chunks/src_app_(akreditasi)_layout_tsx_0bqm455._.js\\\",\\\"/_next/static/chunks/src_0f6od60._.js\\\",\\\"/_next/static/chunks/node_modules_%40base-ui_react_esm_0ltk8uf._.js\\\",\\\"/_next/static/chunks/node_modules_recharts_es6_util_0p1qrly._.js\\\",\\\"/_next/static/chunks/node_modules_recharts_es6_component_0mcbl-i._.js\\\",\\\"/_next/static/chunks/node_modules_recharts_es6_state_06z26d-._.js\\\",\\\"/_next/static/chunks/node_modules_recharts_es6_cartesian_0q_y4ew._.js\\\",\\\"/_next/static/chunks/node_modules_recharts_es6_0j.5k22._.js\\\",\\\"/_next/static/chunks/node_modules_xlsx_xlsx_mjs_13w6-__._.js\\\",\\\"/_next/static/chunks/node_modules_0ml-k8_._.js\\\",\\\"/_next/static/chunks/src_app_(akreditasi)_akreditasi_dashboard_page_tsx_0u8hnbd._.js\\\"],\\\"default\\\"]\\n60:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_0m5k-~q._.js\\\",\\\"/_next/static/chunks/src_0kuf-7q._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\"],\\\"OutletBoundary\\\"]\\n62:\\\"$Sreact.suspense\\\"\\n70:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_0m5k-~q._.js\\\",\\\"/_next/static/chunks/src_0kuf-7q._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\"],\\\"ViewportBoundary\\\"]\\n7a:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_0m5k-~q._.js\\\",\\\"/_next/static/chunks/src_0kuf-7q._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\"],\\\"MetadataBoundary\\\"]\\n81:I[\\\"[project]/node_modules/next/dist/client/components/builtin/global-error.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_0m5k-~q._.js\\\",\\\"/_next/static/chunks/src_0kuf-7q._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_global-error_0bqm455.js\\\"],\\\"default\\\",1]\\n8f:I[\\\"[project]/node_modules/next/dist/lib/metadata/generate/icon-mark.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_0m5k-~q._.js\\\",\\\"/_next/static/chunks/src_0kuf-7q._.js\\\",\\\"/_next/static/chunks/\"])self.__next_f.push([1,\"src_app_layout_tsx_004glpo._.js\\\"],\\\"IconMark\\\"]\\n:HL[\\\"/_next/static/chunks/%5Broot-of-the-server%5D__0o4uq1q._.css\\\",\\\"style\\\"]\\n:HL[\\\"/_next/static/media/797e433ab948586e-s.p.0.q-h669a_dqa.woff2\\\",\\\"font\\\",{\\\"crossOrigin\\\":\\\"\\\",\\\"type\\\":\\\"font/woff2\\\"}]\\n:HL[\\\"/_next/static/media/83afe278b6a6bb3c-s.p.0q-301v4kxxnr.woff2\\\",\\\"font\\\",{\\\"crossOrigin\\\":\\\"\\\",\\\"type\\\":\\\"font/woff2\\\"}]\\n:HL[\\\"/_next/static/media/caa3a2e1cccd8315-s.p.16t1db8_9y2o~.woff2\\\",\\\"font\\\",{\\\"crossOrigin\\\":\\\"\\\",\\\"type\\\":\\\"font/woff2\\\"}]\\n1:D\\\"$7\\\"\\n1:D\\\"$2\\\"\\n1:D\\\"$8\\\"\\n1:null\\n11:D\\\"$1b\\\"\\n11:D\\\"$12\\\"\\n11:D\\\"$1d\\\"\\n26:D\\\"$28\\\"\\n26:D\\\"$27\\\"\\n26:D\\\"$2a\\\"\\n26:D\\\"$29\\\"\\n26:D\\\"$2b\\\"\\n26:[[\\\"$\\\",\\\"title\\\",null,{\\\"children\\\":\\\"404: This page could not be found.\\\"},\\\"$29\\\",\\\"$2c\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"fontFamily\\\":\\\"system-ui,\\\\\\\"Segoe UI\\\\\\\",Roboto,Helvetica,Arial,sans-serif,\\\\\\\"Apple Color Emoji\\\\\\\",\\\\\\\"Segoe UI Emoji\\\\\\\"\\\",\\\"height\\\":\\\"100vh\\\",\\\"textAlign\\\":\\\"center\\\",\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"center\\\"},\\\"children\\\":[\\\"$\\\",\\\"div\\\",null,{\\\"children\\\":[[\\\"$\\\",\\\"style\\\",null,{\\\"dangerouslySetInnerHTML\\\":{\\\"__html\\\":\\\"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}\\\"}},\\\"$29\\\",\\\"$2f\\\",1],[\\\"$\\\",\\\"h1\\\",null,{\\\"className\\\":\\\"next-error-h1\\\",\\\"style\\\":{\\\"display\\\":\\\"inline-block\\\",\\\"margin\\\":\\\"0 20px 0 0\\\",\\\"padding\\\":\\\"0 23px 0 0\\\",\\\"fontSize\\\":24,\\\"fontWeight\\\":500,\\\"verticalAlign\\\":\\\"top\\\",\\\"lineHeight\\\":\\\"49px\\\"},\\\"children\\\":404},\\\"$29\\\",\\\"$30\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"display\\\":\\\"inline-block\\\"},\\\"children\\\":[\\\"$\\\",\\\"h2\\\",null,{\\\"style\\\":{\\\"fontSize\\\":14,\\\"fontWeight\\\":400,\\\"lineHeight\\\":\\\"49px\\\",\\\"margin\\\":0},\\\"children\\\":\\\"This page could not be found.\\\"},\\\"$29\\\",\\\"$32\\\",1]},\\\"$29\\\",\\\"$31\\\",1]]},\\\"$29\\\",\\\"$2e\\\",1]},\\\"$29\\\",\\\"$2d\\\",1]]\\n11:[\\\"$\\\",\\\"html\\\",null,{\\\"lang\\\":\\\"en\\\",\\\"className\\\":\\\"h-full antialiased geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__variable font-sans inter_b2991b2-module__9mH_6q__variable\\\",\\\"children\\\":[\\\"$\\\",\\\"body\\\",null,{\\\"className\\\":\\\"min-h-full flex flex-col\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L20\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$L22\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$L24\\\",null,{},null,\\\"$23\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":[\\\"$\\\",\\\"$La\\\",\\\"c-not-found\\\",{\\\"type\\\":\\\"not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js\\\",\\\"children\\\":[\\\"$26\\\",[]]},null,\\\"$25\\\",0],\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[[\\\"$\\\",\\\"$La\\\",null,{\\\"type\\\":\\\"boundary:not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js@boundary\\\"},null,\\\"$33\\\",1],\\\"$undefined\\\",\\\"$undefined\\\",[\\\"$\\\",\\\"$La\\\",null,{\\\"type\\\":\\\"boundary:global-error\\\",\\\"pagePath\\\":\\\"__next_builtin__global-error.js\\\"},null,\\\"$34\\\",1]]},null,\\\"$21\\\",1]},\\\"$12\\\",\\\"$1f\\\",1],[\\\"$\\\",\\\"$L36\\\",null,{},\\\"$12\\\",\\\"$35\\\",1]]},\\\"$12\\\",\\\"$1e\\\",1]},\\\"$12\\\",\\\"$1c\\\",1]\\n3d:D\\\"$45\\\"\\n3d:D\\\"$3e\\\"\\n5b:D\\\"$5d\\\"\\n5b:D\\\"$5c\\\"\\n5b:D\\\"$5f\\\"\\n5b:[\\\"$\\\",\\\"$L60\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$62\\\",null,{\\\"name\\\":\\\"Next.MetadataOutlet\\\",\\\"children\\\":\\\"$@63\\\"},\\\"$5c\\\",\\\"$61\\\",1]},\\\"$5c\\\",\\\"$5e\\\",1]\\n66:D\\\"$69\\\"\\n66:D\\\"$67\\\"\\n66:D\\\"$6a\\\"\\n66:null\\n6b:D\\\"$6d\\\"\\n6b:D\\\"$6c\\\"\\n6b:D\\\"$6f\\\"\\n71:D\\\"$73\\\"\\n71:D\\\"$72\\\"\\n6b:[\\\"$\\\",\\\"$L70\\\",null,{\\\"children\\\":\\\"$L71\\\"},\\\"$6c\\\",\\\"$6e\\\",1]\\n74:D\\\"$76\\\"\\n74:D\\\"$75\\\"\\n74:D\\\"$78\\\"\\n7c:D\\\"$7e\\\"\\n7c:D\\\"$7d\\\"\\n74:[\\\"$\\\",\\\"div\\\",null,{\\\"hidden\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L7a\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$62\\\",null,{\\\"name\\\":\\\"Next.Metadata\\\",\\\"children\\\":\\\"$L7c\\\"},\\\"$75\\\",\\\"$7b\\\",1]},\\\"$75\\\",\\\"$79\\\",1]},\\\"$75\\\",\\\"$77\\\",1]\\n80:[]\\n\"])self.__next_f.push([1,\"0:{\\\"P\\\":\\\"$1\\\",\\\"c\\\":[\\\"\\\",\\\"akreditasi\\\",\\\"dashboard\\\"],\\\"q\\\":\\\"\\\",\\\"i\\\":true,\\\"f\\\":[[[\\\"\\\",{\\\"children\\\":[\\\"(akreditasi)\\\",{\\\"children\\\":[\\\"akreditasi\\\",{\\\"children\\\":[\\\"dashboard\\\",{\\\"children\\\":[\\\"__PAGE__\\\",{}]}]}]}]},\\\"$undefined\\\",\\\"$undefined\\\",16],[[\\\"$\\\",\\\"$La\\\",\\\"layout\\\",{\\\"type\\\":\\\"layout\\\",\\\"pagePath\\\":\\\"layout.tsx\\\",\\\"children\\\":[\\\"$\\\",\\\"$c\\\",\\\"c\\\",{\\\"children\\\":[[[\\\"$\\\",\\\"link\\\",\\\"0\\\",{\\\"rel\\\":\\\"stylesheet\\\",\\\"href\\\":\\\"/_next/static/chunks/%5Broot-of-the-server%5D__0o4uq1q._.css\\\",\\\"precedence\\\":\\\"next_static/chunks/[root-of-the-server]__0o4uq1q._.css\\\",\\\"crossOrigin\\\":\\\"$undefined\\\",\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$d\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_0m5k-~q._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$e\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-1\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_0kuf-7q._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$f\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-2\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$10\\\",0]],\\\"$11\\\"]},null,\\\"$b\\\",1]},null,\\\"$9\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$La\\\",\\\"layout\\\",{\\\"type\\\":\\\"layout\\\",\\\"pagePath\\\":\\\"(akreditasi)/layout.tsx\\\",\\\"children\\\":[\\\"$\\\",\\\"$c\\\",\\\"c\\\",{\\\"children\\\":[[[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_08gfu~r._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$39\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-1\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_%40base-ui_react_esm_0~mp6fp._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$3a\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-2\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_06wt_rj._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$3b\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-3\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_app_(akreditasi)_layout_tsx_0bqm455._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$3c\\\",0]],\\\"$L3d\\\"]},null,\\\"$38\\\",1]},null,\\\"$37\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$c\\\",\\\"c\\\",{\\\"children\\\":[null,[\\\"$\\\",\\\"$L22\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$L24\\\",null,{},null,\\\"$48\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":\\\"$undefined\\\",\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\"]},null,\\\"$47\\\",1]]},null,\\\"$46\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$c\\\",\\\"c\\\",{\\\"children\\\":[null,[\\\"$\\\",\\\"$L22\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$L24\\\",null,{},null,\\\"$4b\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":\\\"$undefined\\\",\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\"]},null,\\\"$4a\\\",1]]},null,\\\"$49\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$c\\\",\\\"c\\\",{\\\"children\\\":[[\\\"$\\\",\\\"$La\\\",\\\"c-page\\\",{\\\"type\\\":\\\"page\\\",\\\"pagePath\\\":\\\"(akreditasi)/akreditasi/dashboard/page.tsx\\\",\\\"children\\\":[\\\"$\\\",\\\"$L4f\\\",null,{\\\"Component\\\":\\\"$50\\\",\\\"serverProvidedParams\\\":{\\\"searchParams\\\":{},\\\"params\\\":{},\\\"promises\\\":null}},null,\\\"$4e\\\",1]},null,\\\"$4d\\\",1],[[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_0f6od60._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$51\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-1\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_%40base-ui_react_esm_0ltk8uf._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$52\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-2\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_recharts_es6_util_0p1qrly._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$53\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-3\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_recharts_es6_component_0mcbl-i._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$54\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-4\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_recharts_es6_state_06z26d-._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$55\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-5\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_recharts_es6_cartesian_0q_y4ew._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$56\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-6\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_recharts_es6_0j.5k22._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$57\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-7\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_xlsx_xlsx_mjs_13w6-__._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$58\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-8\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_0ml-k8_._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$59\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-9\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_app_(akreditasi)_akreditasi_dashboard_page_tsx_0u8hnbd._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$5a\\\",0]],\\\"$5b\\\"]},null,\\\"$4c\\\",0],{},null,false,null]},null,false,\\\"$@64\\\"]},null,false,\\\"$@64\\\"]},null,false,null]},null,false,null],[\\\"$\\\",\\\"$c\\\",\\\"h\\\",{\\\"children\\\":[\\\"$66\\\",\\\"$6b\\\",\\\"$74\\\",[\\\"$\\\",\\\"meta\\\",null,{\\\"name\\\":\\\"next-size-adjust\\\",\\\"content\\\":\\\"\\\"},null,\\\"$7f\\\",1]]},null,\\\"$65\\\",0],false]],\\\"m\\\":\\\"$W80\\\",\\\"G\\\":[\\\"$81\\\",[\\\"$\\\",\\\"$La\\\",\\\"ge-svn\\\",{\\\"type\\\":\\\"global-error\\\",\\\"pagePath\\\":\\\"__next_builtin__global-error.js\\\",\\\"children\\\":[[\\\"$\\\",\\\"link\\\",\\\"0\\\",{\\\"rel\\\":\\\"stylesheet\\\",\\\"href\\\":\\\"/_next/static/chunks/%5Broot-of-the-server%5D__0o4uq1q._.css\\\",\\\"precedence\\\":\\\"next_static/chunks/[root-of-the-server]__0o4uq1q._.css\\\",\\\"crossOrigin\\\":\\\"$undefined\\\",\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$83\\\",0]]},null,\\\"$82\\\",0]],\\\"S\\\":false,\\\"h\\\":null,\\\"s\\\":\\\"$undefined\\\",\\\"l\\\":\\\"$undefined\\\",\\\"p\\\":\\\"$undefined\\\",\\\"d\\\":\\\"$undefined\\\",\\\"b\\\":\\\"development\\\"}\\n\"])self.__next_f.push([1,\"84:[]\\n64:D\\\"$85\\\"\\n64:\\\"$W84\\\"\\n71:D\\\"$86\\\"\\n71:[[\\\"$\\\",\\\"meta\\\",\\\"0\\\",{\\\"charSet\\\":\\\"utf-8\\\"},\\\"$5c\\\",\\\"$87\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"1\\\",{\\\"name\\\":\\\"viewport\\\",\\\"content\\\":\\\"width=device-width, initial-scale=1\\\"},\\\"$5c\\\",\\\"$88\\\",0]]\\n63:D\\\"$89\\\"\\n63:null\\n7c:D\\\"$8a\\\"\\n7c:[[\\\"$\\\",\\\"title\\\",\\\"0\\\",{\\\"children\\\":\\\"Portal Prestasi Mahasiswa\\\"},\\\"$5c\\\",\\\"$8b\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"1\\\",{\\\"name\\\":\\\"description\\\",\\\"content\\\":\\\"Generated by create next app\\\"},\\\"$5c\\\",\\\"$8c\\\",0],[\\\"$\\\",\\\"link\\\",\\\"2\\\",{\\\"rel\\\":\\\"icon\\\",\\\"href\\\":\\\"/favicon.ico?favicon.0x3dzn~oxb6tn.ico\\\",\\\"sizes\\\":\\\"256x256\\\",\\\"type\\\":\\\"image/x-icon\\\"},\\\"$5c\\\",\\\"$8d\\\",0],[\\\"$\\\",\\\"$L8f\\\",\\\"3\\\",{},\\\"$5c\\\",\\\"$8e\\\",0]]\\n\"])self.__next_f.push([1,\"c7:I[\\\"[project]/src/components/ui/sidebar.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_0m5k-~q._.js\\\",\\\"/_next/static/chunks/src_0kuf-7q._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/src_08gfu~r._.js\\\",\\\"/_next/static/chunks/node_modules_%40base-ui_react_esm_0~mp6fp._.js\\\",\\\"/_next/static/chunks/node_modules_06wt_rj._.js\\\",\\\"/_next/static/chunks/src_app_(akreditasi)_layout_tsx_0bqm455._.js\\\"],\\\"SidebarProvider\\\"]\\nc9:I[\\\"[project]/src/components/app-sidebar.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_0m5k-~q._.js\\\",\\\"/_next/static/chunks/src_0kuf-7q._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/src_08gfu~r._.js\\\",\\\"/_next/static/chunks/node_modules_%40base-ui_react_esm_0~mp6fp._.js\\\",\\\"/_next/static/chunks/node_modules_06wt_rj._.js\\\",\\\"/_next/static/chunks/src_app_(akreditasi)_layout_tsx_0bqm455._.js\\\"],\\\"AppSidebar\\\"]\\ncb:I[\\\"[project]/src/components/ui/sidebar.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_0m5k-~q._.js\\\",\\\"/_next/static/chunks/src_0kuf-7q._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/src_08gfu~r._.js\\\",\\\"/_next/static/chunks/node_modules_%40base-ui_react_esm_0~mp6fp._.js\\\",\\\"/_next/static/chunks/node_modules_06wt_rj._.js\\\",\\\"/_next/static/chunks/src_app_(akreditasi)_layout_tsx_0bqm455._.js\\\"],\\\"SidebarInset\\\"]\\ncd:I[\\\"[project]/src/components/topbar.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_0m5k-~q._.js\\\",\\\"/_next/static/chunks/src_0kuf-7q._.js\\\",\\\"/_next/static/chunks/src_app_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/src_08gfu~r._.js\\\",\\\"/_next/static/chunks/node_modules_%40base-ui_react_esm_0~mp6fp._.js\\\",\\\"/_next/static/chunks/node_modules_06wt_rj._.js\\\",\\\"/_next/static/chunks/src_app_(akreditasi)_layout_tsx_0bqm455._.js\\\"],\\\"Topbar\\\"]\\n3d:D\\\"$93\\\"\\n3d:D\\\"$95\\\"\\n3d:D\\\"$96\\\"\\n3d:D\\\"$9a\\\"\\n3d:D\\\"$9c\\\"\\n3d:D\\\"$9d\\\"\\n3d:D\\\"$a2\\\"\\n3d:D\\\"$a3\\\"\\n3d:D\\\"$ad\\\"\\n3d:D\\\"$af\\\"\\n3d:D\\\"$b0\\\"\\n3d:D\\\"$c6\\\"\\nd2:D\\\"$d4\\\"\\nd2:D\\\"$d3\\\"\\nd2:D\\\"$d6\\\"\\nd2:D\\\"$d5\\\"\\nd2:D\\\"$d7\\\"\\nd2:[[\\\"$\\\",\\\"title\\\",null,{\\\"children\\\":\\\"404: This page could not be found.\\\"},\\\"$d5\\\",\\\"$d8\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":\\\"$26:1:props:style\\\",\\\"children\\\":[\\\"$\\\",\\\"div\\\",null,{\\\"children\\\":[[\\\"$\\\",\\\"style\\\",null,{\\\"dangerouslySetInnerHTML\\\":{\\\"__html\\\":\\\"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}\\\"}},\\\"$d5\\\",\\\"$db\\\",1],[\\\"$\\\",\\\"h1\\\",null,{\\\"className\\\":\\\"next-error-h1\\\",\\\"style\\\":\\\"$26:1:props:children:props:children:1:props:style\\\",\\\"children\\\":404},\\\"$d5\\\",\\\"$dc\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":\\\"$26:1:props:children:props:children:2:props:style\\\",\\\"children\\\":[\\\"$\\\",\\\"h2\\\",null,{\\\"style\\\":\\\"$26:1:props:children:props:children:2:props:children:props:style\\\",\\\"children\\\":\\\"This page could not be found.\\\"},\\\"$d5\\\",\\\"$de\\\",1]},\\\"$d5\\\",\\\"$dd\\\",1]]},\\\"$d5\\\",\\\"$da\\\",1]},\\\"$d5\\\",\\\"$d9\\\",1]]\\n3d:[\\\"$\\\",\\\"$Lc7\\\",null,{\\\"children\\\":[[\\\"$\\\",\\\"$Lc9\\\",null,{\\\"role\\\":\\\"akreditasi\\\"},\\\"$3e\\\",\\\"$c8\\\",1],[\\\"$\\\",\\\"$Lcb\\\",null,{\\\"className\\\":\\\"bg-gray-50 flex flex-col min-h-screen\\\",\\\"children\\\":[[\\\"$\\\",\\\"$Lcd\\\",null,{\\\"userName\\\":\\\"akreditasi test\\\",\\\"userEmail\\\":\\\"akreditasi.test@telkomuniversity.ac.id\\\",\\\"userId\\\":\\\"W1TrJOzbWnVFf0s0Le82XkPm5e0mLLhR\\\"},\\\"$3e\\\",\\\"$cc\\\",1],[\\\"$\\\",\\\"main\\\",null,{\\\"className\\\":\\\"flex-1 p-6 overflow-auto\\\",\\\"children\\\":[\\\"$\\\",\\\"$L22\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$L24\\\",null,{},null,\\\"$d0\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":[\\\"$\\\",\\\"$La\\\",\\\"c-not-found\\\",{\\\"type\\\":\\\"not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js\\\",\\\"children\\\":[\\\"$d2\\\",[]]},null,\\\"$d1\\\",0],\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[[\\\"$\\\",\\\"$La\\\",null,{\\\"type\\\":\\\"boundary:not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js@boundary\\\"},null,\\\"$df\\\",1],\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\"]},null,\\\"$cf\\\",1]},\\\"$3e\\\",\\\"$ce\\\",1]]},\\\"$3e\\\",\\\"$ca\\\",1]]},\\\"$3e\\\",\\\"$c5\\\",1]\\n\"])Teknik Industri0"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e5]:
      - generic [ref=e7]:
        - heading "Portal Data Prestasi" [level=2] [ref=e8]:
          - text: Portal Data
          - text: Prestasi
        - generic [ref=e9]: S1 Teknik Industri
      - list [ref=e13]:
        - listitem [ref=e14]:
          - link "Dashboard Akreditasi" [ref=e15] [cursor=pointer]:
            - /url: /akreditasi/dashboard
            - img [ref=e16]
            - generic [ref=e18]: Dashboard Akreditasi
        - listitem [ref=e19]:
          - link "Rekap 5 Tahun" [ref=e20] [cursor=pointer]:
            - /url: /akreditasi/rekap
            - img [ref=e21]
            - generic [ref=e24]: Rekap 5 Tahun
      - list [ref=e26]:
        - listitem [ref=e27]:
          - button "Logout" [ref=e28] [cursor=pointer]:
            - img [ref=e29]
            - generic [ref=e32]: Logout
    - main [ref=e33]:
      - generic [ref=e34]:
        - button "Toggle Sidebar" [ref=e36] [cursor=pointer]:
          - img
          - generic [ref=e37]: Toggle Sidebar
        - button "akreditasi test akreditasi.test@telkomuniversity.ac.id" [ref=e39] [cursor=pointer]:
          - generic [ref=e40]:
            - generic [ref=e41]:
              - generic [ref=e42]: akreditasi test
              - generic [ref=e43]: akreditasi.test@telkomuniversity.ac.id
            - img [ref=e46]
            - img [ref=e49]
      - main [ref=e51]:
        - generic [ref=e52]:
          - generic [ref=e53]:
            - generic [ref=e54]:
              - heading "Dashboard Akreditasi" [level=1] [ref=e55]
              - paragraph [ref=e56]: Analitik prestasi mahasiswa untuk LAM TEKNIK
            - button "Export Excel" [ref=e57] [cursor=pointer]:
              - img
              - text: Export Excel
          - generic [ref=e58]:
            - generic [ref=e59]:
              - img [ref=e60]
              - heading "Filter Data & Rentang Waktu" [level=2] [ref=e62]
            - generic [ref=e63]:
              - generic [ref=e64]:
                - generic [ref=e65]: Tahun Sasaran (TS)
                - combobox [ref=e66] [cursor=pointer]:
                  - generic [ref=e67]: "2026"
                  - img
                - textbox [ref=e68]: "2026"
              - generic [ref=e69]:
                - generic [ref=e70]: Rentang (Untuk Indikator)
                - combobox [ref=e71] [cursor=pointer]:
                  - generic [ref=e72]: "5"
                  - img
                - textbox [ref=e73]: "5"
              - generic [ref=e74]:
                - generic [ref=e75]: Kategori
                - combobox [ref=e76] [cursor=pointer]:
                  - generic [ref=e77]: Semua Kategori
                  - img
                - textbox [ref=e78]: Semua
              - generic [ref=e79]:
                - generic [ref=e80]: Level
                - combobox [ref=e81] [cursor=pointer]:
                  - generic [ref=e82]: Semua Level
                  - img
                - textbox [ref=e83]: Semua
              - generic [ref=e84]:
                - generic [ref=e85]: Program Studi
                - combobox [ref=e86] [cursor=pointer]:
                  - generic [ref=e87]: Teknik Industri
                  - img
                - textbox [ref=e88]: cmpqywr280006r8w7vzuoal2t
          - generic [ref=e89]:
            - heading "Indikator Akreditasi (LAM TEKNIK) NM(TS) Belum Diatur" [level=2] [ref=e90]:
              - generic [ref=e91]: Indikator Akreditasi (LAM TEKNIK)
              - generic [ref=e92]: NM(TS) Belum Diatur
            - generic [ref=e93]:
              - generic [ref=e94]:
                - paragraph [ref=e95]: Prestasi Internasional (RI)
                - generic [ref=e96]:
                  - generic [ref=e97]: "1"
                  - generic [ref=e98]: (0.00%) / 0.2% target
              - generic [ref=e100]:
                - paragraph [ref=e101]: Prestasi Nasional (RN)
                - generic [ref=e102]:
                  - generic [ref=e103]: "0"
                  - generic [ref=e104]: (0.00%) / 2% target
              - generic [ref=e106]:
                - paragraph [ref=e107]: Prestasi Wilayah/Lokal (RW)
                - generic [ref=e108]:
                  - generic [ref=e109]: "0"
                  - generic [ref=e110]: (0.00%) / 4% target
          - generic [ref=e112]:
            - heading "Tren Prestasi 5 Tahun (Berdasarkan TS)" [level=2] [ref=e113]:
              - img [ref=e114]
              - text: Tren Prestasi 5 Tahun (Berdasarkan TS)
            - application [ref=e121]:
              - generic [ref=e151]:
                - generic [ref=e152]:
                  - generic [ref=e154]: "2022"
                  - generic [ref=e156]: "2023"
                  - generic [ref=e158]: "2024"
                  - generic [ref=e160]: "2025"
                  - generic [ref=e162]: "2026"
                - generic [ref=e163]:
                  - generic [ref=e165]: "0"
                  - generic [ref=e167]: "0.25"
                  - generic [ref=e169]: "0.5"
                  - generic [ref=e171]: "0.75"
                  - generic [ref=e173]: "1"
          - generic [ref=e174]:
            - generic [ref=e176]:
              - heading "Summary Prestasi 5 Tahun" [level=2] [ref=e177]
              - paragraph [ref=e178]: Matriks rekapitulasi data prestasi mahasiswa
            - table [ref=e180]:
              - rowgroup [ref=e181]:
                - row "Tahun Kategori Internasional Nasional Wilayah/Lokal Total" [ref=e182]:
                  - columnheader "Tahun" [ref=e183]
                  - columnheader "Kategori" [ref=e184]
                  - columnheader "Internasional" [ref=e185]
                  - columnheader "Nasional" [ref=e186]
                  - columnheader "Wilayah/Lokal" [ref=e187]
                  - columnheader "Total" [ref=e188]
              - rowgroup [ref=e189]:
                - row "2026 Akademik 0 0 0 0" [ref=e190]:
                  - cell "2026" [ref=e191]
                  - cell "Akademik" [ref=e192]
                  - cell "0" [ref=e193]
                  - cell "0" [ref=e194]
                  - cell "0" [ref=e195]
                  - cell "0" [ref=e196]
                - row "2026 Non-Akademik 0 0 0 0" [ref=e197]:
                  - cell "2026" [ref=e198]
                  - cell "Non-Akademik" [ref=e199]
                  - cell "0" [ref=e200]
                  - cell "0" [ref=e201]
                  - cell "0" [ref=e202]
                  - cell "0" [ref=e203]
                - row "2025 Akademik 0 0 0 0" [ref=e204]:
                  - cell "2025" [ref=e205]
                  - cell "Akademik" [ref=e206]
                  - cell "0" [ref=e207]
                  - cell "0" [ref=e208]
                  - cell "0" [ref=e209]
                  - cell "0" [ref=e210]
                - row "2025 Non-Akademik 0 0 0 0" [ref=e211]:
                  - cell "2025" [ref=e212]
                  - cell "Non-Akademik" [ref=e213]
                  - cell "0" [ref=e214]
                  - cell "0" [ref=e215]
                  - cell "0" [ref=e216]
                  - cell "0" [ref=e217]
                - row "2024 Akademik 0 0 0 0" [ref=e218]:
                  - cell "2024" [ref=e219]
                  - cell "Akademik" [ref=e220]
                  - cell "0" [ref=e221]
                  - cell "0" [ref=e222]
                  - cell "0" [ref=e223]
                  - cell "0" [ref=e224]
                - row "2024 Non-Akademik 0 0 0 0" [ref=e225]:
                  - cell "2024" [ref=e226]
                  - cell "Non-Akademik" [ref=e227]
                  - cell "0" [ref=e228]
                  - cell "0" [ref=e229]
                  - cell "0" [ref=e230]
                  - cell "0" [ref=e231]
                - row "2023 Akademik 0 0 0 0" [ref=e232]:
                  - cell "2023" [ref=e233]
                  - cell "Akademik" [ref=e234]
                  - cell "0" [ref=e235]
                  - cell "0" [ref=e236]
                  - cell "0" [ref=e237]
                  - cell "0" [ref=e238]
                - row "2023 Non-Akademik 0 0 0 0" [ref=e239]:
                  - cell "2023" [ref=e240]
                  - cell "Non-Akademik" [ref=e241]
                  - cell "0" [ref=e242]
                  - cell "0" [ref=e243]
                  - cell "0" [ref=e244]
                  - cell "0" [ref=e245]
                - row "2022 Akademik 1 0 0 1" [ref=e246]:
                  - cell "2022" [ref=e247]
                  - cell "Akademik" [ref=e248]
                  - cell "1" [ref=e249]
                  - cell "0" [ref=e250]
                  - cell "0" [ref=e251]
                  - cell "1" [ref=e252]
                - row "2022 Non-Akademik 0 0 0 0" [ref=e253]:
                  - cell "2022" [ref=e254]
                  - cell "Non-Akademik" [ref=e255]
                  - cell "0" [ref=e256]
                  - cell "0" [ref=e257]
                  - cell "0" [ref=e258]
                  - cell "0" [ref=e259]
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e265] [cursor=pointer]:
    - img [ref=e266]
  - alert [ref=e269]
  - generic [ref=e270]: "0"
```

# Test source

```ts
  138 |       );
  139 | 
  140 |       if (await exportBtn.isVisible()) {
  141 |         // Setup download handler
  142 |         const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
  143 |         await exportBtn.click();
  144 | 
  145 |         try {
  146 |           const download = await downloadPromise;
  147 |           // File harus ter-download dengan nama yang valid
  148 |           expect(download.suggestedFilename()).toMatch(/\.(xlsx|csv|pdf)$/i);
  149 |         } catch {
  150 |           // Download mungkin diblokir di test env, yang penting tidak crash
  151 |           await expect(page.locator('body')).not.toContainText(/500/i);
  152 |         }
  153 |       }
  154 |     });
  155 | 
  156 |   });
  157 | 
  158 |   // ──────────────────────────────────────────────────────────────────────────
  159 |   // Otorisasi: Akreditasi tidak bisa akses area lain
  160 |   // ──────────────────────────────────────────────────────────────────────────
  161 | 
  162 |   test.describe('Otorisasi Akreditasi - Hanya Akses Dashboard Akreditasi', () => {
  163 | 
  164 |     test('Akreditasi tidak dapat mengakses /admin/dashboard', async ({ page }) => {
  165 |       await page.goto('/admin/dashboard');
  166 |       await expect(page).not.toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
  167 |     });
  168 | 
  169 |     test('Akreditasi tidak dapat mengakses /admin/verifikasi', async ({ page }) => {
  170 |       await page.goto('/admin/verifikasi');
  171 |       await expect(page).not.toHaveURL(/\/admin\/verifikasi/, { timeout: 10000 });
  172 |     });
  173 | 
  174 |     test('Akreditasi tidak dapat mengakses dashboard mahasiswa', async ({ page }) => {
  175 |       await page.goto('/dashboard');
  176 |       // Middleware redirect ke dashboard akreditasi
  177 |       await expect(page).toHaveURL(/\/akreditasi\/dashboard/, { timeout: 10000 });
  178 |     });
  179 | 
  180 |     test('Akreditasi tidak dapat mengakses dashboard WD', async ({ page }) => {
  181 |       await page.goto('/wd1/dashboard');
  182 |       await expect(page).not.toHaveURL(/\/wd1\/dashboard/, { timeout: 10000 });
  183 |     });
  184 | 
  185 |     test('Akreditasi tidak dapat mengakses dashboard Kaprodi', async ({ page }) => {
  186 |       await page.goto('/kaprodi/dashboard');
  187 |       await expect(page).not.toHaveURL(/\/kaprodi\/dashboard/, { timeout: 10000 });
  188 |     });
  189 | 
  190 |   });
  191 | 
  192 |   // ──────────────────────────────────────────────────────────────────────────
  193 |   // Fungsionalitas Akreditasi - Read Only
  194 |   // ──────────────────────────────────────────────────────────────────────────
  195 | 
  196 |   test.describe('Fungsionalitas Akreditasi - Akses Baca', () => {
  197 | 
  198 |     test('Dashboard Akreditasi tidak menampilkan tombol Approve/Reject/Delete', async ({ page }) => {
  199 |       await page.waitForLoadState('networkidle');
  200 | 
  201 |       const approveBtn = page.getByRole('button', { name: /valid|approve|setuju/i });
  202 |       const rejectBtn = page.getByRole('button', { name: /tolak|reject|ditolak/i });
  203 |       const deleteBtn = page.getByRole('button', { name: /hapus|delete/i });
  204 | 
  205 |       expect(await approveBtn.count()).toBe(0);
  206 |       expect(await rejectBtn.count()).toBe(0);
  207 |       expect(await deleteBtn.count()).toBe(0);
  208 |     });
  209 | 
  210 |     test('Akreditasi dapat mengakses halaman notifikasi', async ({ page }) => {
  211 |       await page.goto('/akreditasi/notifikasi');
  212 |       await page.waitForLoadState('networkidle');
  213 |       await expect(page).not.toHaveURL(/\/sign-in/);
  214 |       await expect(page.locator('body')).not.toContainText(/500/i);
  215 |     });
  216 | 
  217 |     test('Akreditasi dapat mengakses halaman pengaturan profil', async ({ page }) => {
  218 |       await page.goto('/akreditasi/pengaturan');
  219 |       await page.waitForLoadState('networkidle');
  220 |       await expect(page).not.toHaveURL(/\/sign-in/);
  221 |       await expect(page.locator('body')).not.toContainText(/500/i);
  222 |     });
  223 | 
  224 |   });
  225 | 
  226 |   // ──────────────────────────────────────────────────────────────────────────
  227 |   // Integritas Data Akreditasi (UAT Section 3)
  228 |   // ──────────────────────────────────────────────────────────────────────────
  229 | 
  230 |   test.describe('Integritas Data Akreditasi - Validasi Angka', () => {
  231 | 
  232 |     test('Angka statistik pada dashboard tidak bernilai NaN atau undefined', async ({ page }) => {
  233 |       await page.waitForLoadState('networkidle');
  234 | 
  235 |       // Verifikasi tidak ada nilai NaN atau undefined tampil di UI
  236 |       const bodyText = await page.locator('body').textContent();
  237 |       expect(bodyText).not.toContain('NaN');
> 238 |       expect(bodyText).not.toMatch(/\bundefined\b/);
      |                            ^ Error: expect(received).not.toMatch(expected)
  239 |     });
  240 | 
  241 |     test('Visualisasi recharts ter-render tanpa crash untuk data akreditasi', async ({ page }) => {
  242 |       await page.waitForLoadState('networkidle');
  243 | 
  244 |       const errors: string[] = [];
  245 |       page.on('pageerror', (err) => errors.push(err.message));
  246 | 
  247 |       await page.reload();
  248 |       await page.waitForLoadState('networkidle');
  249 | 
  250 |       // Tidak ada error JavaScript yang crash
  251 |       const criticalErrors = errors.filter(e =>
  252 |         e.toLowerCase().includes('cannot read') ||
  253 |         e.toLowerCase().includes('is not a function') ||
  254 |         e.toLowerCase().includes('undefined is not')
  255 |       );
  256 |       expect(criticalErrors).toHaveLength(0);
  257 |     });
  258 | 
  259 |   });
  260 | 
  261 | });
  262 | 
```