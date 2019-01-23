import Layout from '@index/views/layout/Layout'

export const componentsDemos = {
  path: '/components',
  alwaysShow: true,
  component: Layout,
  redirect: 'noredirect',
  name: 'component-demo',
  meta: {
    title: 'components',
    icon: 'component'
  },
  children: [
    { path: 'tinymce', component: () => import('@index/views/components-demo/tinymce'), hidden: true, name: 'tinymce-demo', meta: { title: 'tinymce' }},
    { path: 'markdown', component: () => import('@index/views/components-demo/markdown'), hidden: true, name: 'markdown-demo', meta: { title: 'markdown' }},
    { path: 'json-editor', component: () => import('@index/views/components-demo/jsonEditor'), hidden: true, name: 'jsonEditor-demo', meta: { title: 'jsonEditor' }},
    { path: 'splitpane', component: () => import('@index/views/components-demo/splitpane'), hidden: true, name: 'splitpane-demo', meta: { title: 'splitPane' }},
    { path: 'avatar-upload', component: () => import('@index/views/components-demo/avatarUpload'), hidden: true, name: 'avatarUpload-demo', meta: { title: 'avatarUpload' }},
    { path: 'dropzone', component: () => import('@index/views/components-demo/dropzone'), hidden: true, name: 'dropzone-demo', meta: { title: 'dropzone' }},
    { path: 'sticky', component: () => import('@index/views/components-demo/sticky'), hidden: true, name: 'sticky-demo', meta: { title: 'sticky' }},
    { path: 'count-to', component: () => import('@index/views/components-demo/countTo'), hidden: true, name: 'countTo-demo', meta: { title: 'countTo' }},
    { path: 'mixin', component: () => import('@index/views/components-demo/mixin'), hidden: true, name: 'componentMixin-demo', meta: { title: 'componentMixin' }},
    { path: 'back-to-top', component: () => import('@index/views/components-demo/backToTop'), hidden: true, name: 'backToTop-demo', meta: { title: 'backToTop' }},
    { path: 'drag-dialog', component: () => import('@index/views/components-demo/dragDialog'), hidden: true, name: 'dragDialog-demo', meta: { title: 'dragDialog' }},
    { path: 'dnd-list', component: () => import('@index/views/components-demo/dndList'), hidden: true, name: 'dndList-demo', meta: { title: 'dndList' }},
    { path: 'drag-kanban', component: () => import('@index/views/components-demo/dragKanban'), name: 'dragKanban-demo', meta: { title: 'dragKanban' }}
  ]
}

export const clipboard = {
  path: '/clipboard',
  component: Layout,
  redirect: 'noredirect',
  children: [{ path: 'index', component: () => import('@index/views/clipboard/index'), name: 'clipboardDemo', meta: { title: 'clipboardDemo', icon: 'clipboard' }}]
}

export const iconsRouter = {
  path: '/icon',
  component: Layout,
  children: [{
    path: 'index',
    component: () => import('@index/views/svg-icons/index'),
    name: 'icons',
    meta: { title: 'icons', icon: 'icon', noCache: true }
  }]
}
