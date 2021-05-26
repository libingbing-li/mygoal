状态保持-react-activation 和dva，umi之间该如何一起使用



在task页面完成的任务可以随时修改完成状态，会在task页面停留一天的时间，第二天index的init会统计昨天完成的任务，并进行历史添加，删除以及添加目标任务数据


测试代码未删除：
1. index.ts 任务的nowTime延长了一天，（为的是测试即时进行处理