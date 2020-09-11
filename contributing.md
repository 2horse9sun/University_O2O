# 项目贡献指南

## 贡献的方向

1. 对小程序的UI进行美化。由于本项目混合使用了组件库和CSS库，渲染层的代码难免十分混乱，不利于后期维护。希望贡献者能统一小程序的UI库，使渲染层的代码易于维护，同时使小程序样式更加丰富，界面更加美观。
2. 优化小程序的部分逻辑层。本项目涉及到的界面交互功能较多，由于时间仓促，很多JS逻辑写得不是很完善，存在累赘或漏洞。希望贡献者能优化逻辑层的代码，提高小程序的性能。
3. 优化小程序的云函数。本项目涉及到的云函数较多，难免有某些云函数的功能不够完善，或是存在累赘甚至错误。为了提高小程序的后端性能，希望贡献者能够进一步根据官方文档对小程序的云函数做出合理的改进。
4. 添加/修改/删除部分业务功能。如学生验证、轮播图等功能。
5. 统一代码风格。由于时间仓促，某些变量的命名可能存在前后不一致的问题。

## 指南

此指南完全摘录于：https://testerhome.com/topics/20680%3Forder_by%3Dcreated_at%26

### Fork 仓库

由于此时大家并没有对当前开源项目仓库进行修改的权限，因此需要通过 fork ，将此仓库复制一份到自己的名字下，从而得到一个自己有权限提交代码的仓库。

[![img](https://testerhome.com/uploads/photo/2019/f9797f26-e893-4768-8d5b-fb27b7fce0b4.png!large)](https://testerhome.com/uploads/photo/2019/f9797f26-e893-4768-8d5b-fb27b7fce0b4.png!large)

Fork 完毕后，会在自己的名下得到一个和原来开源项目仓库一模一样的仓库：

[![img](https://testerhome.com/uploads/photo/2019/1a586a0e-9dc9-4b6d-a140-45aa12899435.png!large)

### 开发+自测+提交代码

当完成了 Fork 操作后，可以 clone 下自己的仓库代码，并在本地基于 master 建立新的分支，进行开发、自测，并在自测通过后提交代码到自己的远程仓库。

### 提交 pull request

通过前一步骤，对应的修改代码已经放到了你自己 fork 出来的仓库里了，此时需要通过提交 pull request （后续简称 PR）来提交一个申请，把你的这部分修改代码合并到原来开源项目的仓库中。

当你的代码 push 到自己的远程仓库后，在 github 仓库首页，会见到一个自动提示，可以直接点击 【Compare & pull request】进入 PR 创建页面。

[![img](https://testerhome.com/uploads/photo/2019/7a2da1e7-5ca3-4a96-a62b-e930f47ccd2a.png!large)](https://testerhome.com/uploads/photo/2019/7a2da1e7-5ca3-4a96-a62b-e930f47ccd2a.png!large)

在 PR 创建页面，完成以下5项检查，最后点击 【Create Pull Request】提交你的修改。

[![img](https://testerhome.com/uploads/photo/2019/a9823009-9c12-4ff5-b747-582b641acc3d.png!large)](https://testerhome.com/uploads/photo/2019/a9823009-9c12-4ff5-b747-582b641acc3d.png!large)

提交完成后，将进入 PR 展示页面，你的 PR 将会出现在开源项目的 PR 列表中，并通知项目作者。

### 后续修改

PR 提交后，作者会进行 Review ，个别项目还会自动触发一些自动化检查和测试。若这些检查没有通过，会在 PR 页面上有对应提示，此时需要再次修改代码。

修改时，不需要重新提交 PR ，只需要直接在 PR 中自己仓库的分支进行修改，push，并在修改完毕后在 PR 中添加评论说明修改已提交即可。

另外，请特别注意，任何 PR 不应该存在和原有官方仓库的代码冲突。若存在，请自行修复。