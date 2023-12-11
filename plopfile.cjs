module.exports = plop => {
  plop.setGenerator('view', {
    description: '视图组件', // 描述
    // 命令式交互配置
    prompts: [
      {
        type: 'input',
        name: 'paths',
        message: '文件名',
        validate(value) {
          if (!value) return '文件名不能为空'
          return true
        }
      }
    ],
    // 完成命令行交互后需要执行的一系列动作
    actions: function (data) {
      data['newPath'] = data.paths.includes('/') ? data.paths.split('/')[0] : data.paths
      let newName = data['newPath'].replace(/^\S/, s => s.toUpperCase())
      console.log(data)
      const actions = [
        {
          type: 'add', // 表示添加新文件
          path: 'src/views/{{newPath}}/index.vue', // 指定文件的输出路径
          templateFile: './plop-templates/index.hbs', // 指定模板文件
          data: {
            name: newName,
            path: data.newPath
          }
        },
        {
          type: 'add', // 表示添加新文件
          path: 'src/views/{{newPath}}/index.ts', // 指定文件的输出路径
          templateFile: './plop-templates/index2.hbs' // 指定模板文件
        },
        {
          type: 'add', // 表示添加新文件
          path: 'src/i18n/modules/{{newPath}}.ts', // 指定文件的输出路径
          templateFile: './plop-templates/i18n.hbs', // 指定模板文件
          data: {
            name: data.newPath
          }
        },
        {
          type: 'add', // 表示添加新文件
          path: 'src/apis/{{newPath}}/index.ts', // 指定文件的输出路径
          templateFile: './plop-templates/api.hbs', // 指定模板文件
          data: {
            name: newName,
            path: data.newPath
          }
        },
        {
          type: 'add', // 表示添加新文件
          path: 'src/apis/{{newPath}}/type.ts', // 指定文件的输出路径
          templateFile: './plop-templates/apiType.hbs', // 指定模板文件
          data: {
            name: newName,
            path: data.newPath
          }
        }
      ]
      return actions
    }
  })
  plop.setGenerator('i18n', {
    description: '视图组件', // 描述
    // 命令式交互配置
    prompts: [
      {
        type: 'input',
        name: 'path',
        message: '文件名',
        validate(value) {
          if (!value) return '文件名不能为空'
          return true
        }
      }
    ],
    // 完成命令行交互后需要执行的一系列动作
    actions: function (data) {
      return [
        {
          type: 'add', // 表示添加新文件
          path: 'src/i18n/modules/{{path}}.ts', // 指定文件的输出路径
          templateFile: './plop-templates/i18n.hbs', // 指定模板文件
          data: {
            name: data.path
          }
        }
      ]
    }
  })
  plop.setGenerator('api', {
    description: '视图组件', // 描述
    // 命令式交互配置
    prompts: [
      {
        type: 'input',
        name: 'path',
        message: '文件名',
        validate(value) {
          if (!value) return '文件名不能为空'
          return true
        }
      }
    ],
    // 完成命令行交互后需要执行的一系列动作
    actions: function (data) {
      let newName = data.path.replace(/^\S/, s => s.toUpperCase())
      return [
        {
          type: 'add', // 表示添加新文件
          path: 'src/apis/{{path}}/index.ts', // 指定文件的输出路径
          templateFile: './plop-templates/api.hbs', // 指定模板文件
          data: {
            name: newName,
            path: data.path
          }
        },
        {
          type: 'add', // 表示添加新文件
          path: 'src/apis/{{path}}/type.ts', // 指定文件的输出路径
          templateFile: './plop-templates/apiType.hbs', // 指定模板文件
          data: {
            name: newName,
            path: data.path
          }
        }
      ]
    }
  })
}
