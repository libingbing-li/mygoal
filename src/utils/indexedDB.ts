import app from './app';
// 使用indexedDB数据库保存数据,全部为异步操作,所以需要返回promise以便进行后续操作(类似发请求,本处就为app的后台)

// 实例的存储
const list = [
  // 目标
  [
    'Goals',
    [
      'timeId',
      'endTimeId',
      'title',
      'description',
      'finishDescription',
      'dayTasks',
      'weekTasks',
      'monthTasks',
    ],
  ],
  // 任务
  ['Tasks', ['timeId', 'endTimeId', 'txt']],
  // 历史
  ['Histories', ['timeId', 'tasks', 'goals']],
];

const objectStoreNamesList = new Map();
list.forEach(([key, value]) => objectStoreNamesList.set(key, value));

class IndexedDB {
  database: IDBDatabase | undefined = undefined; //数据库
  // 构造方法
  constructor() {
    this.openDataBase();
  }

  // 打开数据库
  openDataBase() {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      // 在此新建数据库并创建好所有需要的表(对象仓库)和数据结构
      let request = window.indexedDB.open('MyGoal'); //一个打开数据库的请求
      request.onupgradeneeded = (e: any) => {
        this.database = e.target.result;
        // 在此进行数据结构的构造-存放Note日记的表
        for (let [name, indexNames] of objectStoreNamesList) {
          let objectStore = this.database?.createObjectStore(name, {
            keyPath: 'timeId',
          }); //设定时间戳为主键
          indexNames.forEach((indexName: string) => {
            objectStore?.createIndex(indexName, indexName, { unique: false }); //创建索引
          });
        }
        console.log('新建数据库');
        resolve(true);
      };
      request.onsuccess = (e: any) => {
        // 打开数据库
        this.database = e.target.result;
        console.log('数据库已打开');
        resolve(true);
      };
      request.onerror = (e: any) => {
        // 失败了
        console.log('打开本地数据库失败');
        app.info('打开本地数据库失败');
        resolve(false);
      };
    });
    return promise;
  }

  // 增删查改
  // 添加数据 - 实例: 添加类,成功再添加实例
  add(name: string, data: any) {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      // 添加方法
      let objectStore = _this.database
        ?.transaction(name, 'readwrite')
        .objectStore(name);
      let request = objectStore?.add(data);
      if (request) {
        request.onsuccess = () => {
          console.log('add-success');
          resolve(true);
        };
        request.onerror = () => {
          console.log('add-error');
          resolve(false);
        };
      }
    });
    return promise;
  }

  // 更新数据 - time
  put(name: string, data: any) {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      let objectStore = _this.database
        ?.transaction(name, 'readwrite')
        .objectStore(name);
      let request = objectStore?.put(data); // 根据对象仓库的主键更新
      if (request) {
        request.onsuccess = () => {
          resolve(true);
          console.log('put-success');
        };
        request.onerror = () => {
          resolve(false);
          console.log('put-error');
        };
      }
    });
    return promise;
  }

  // 删除
  remove = (name: string, time: number) => {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      let objectStore = _this.database
        ?.transaction(name, 'readwrite')
        .objectStore(name);
      let request = objectStore?.delete(time); // 根据对象仓库的主键更新
      if (request) {
        request.onsuccess = () => {
          resolve(true);
          console.log('remove-success');
        };
        request.onerror = () => {
          resolve(false);
          console.log('remove-error');
        };
      }
    });
    return promise;
  };

  // 获取筛选/全部数据 数据库名称， 索引？ 精确搜索key？ 范围上下ke？ prev倒序
  getData = (
    name: string,
    indexName?: string,
    key?: any,
    minKey?: any,
    maxKey?: any,
    prev?: any,
  ) => {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      let objectStore = this.database?.transaction(name).objectStore(name);
      let objectStoreIndex = indexName
        ? objectStore?.index(indexName)
        : objectStore;
      // 获取关键字 IDBKeyRange 限定范围
      let keyRangeValue = key
        ? IDBKeyRange.only(key)
        : minKey || maxKey
        ? minKey && maxKey
          ? IDBKeyRange.bound(minKey, maxKey)
          : minKey
          ? IDBKeyRange.lowerBound(minKey)
          : IDBKeyRange.upperBound(maxKey)
        : undefined;
      let request = objectStoreIndex?.count(keyRangeValue);
      let length = 0;
      if (request) {
        request.onsuccess = (e: any) => {
          length = e.target.result;
          if (length) {
            let request = objectStoreIndex?.openCursor(keyRangeValue, prev);
            let data: any = [];
            let i = 0;
            if (request) {
              request.onsuccess = (e: any) => {
                const cursor = e.target.result;
                if (cursor) {
                  data.push(cursor.value);
                  i++;
                  if (i < length) {
                    cursor.continue();
                  } else {
                    resolve(data);
                  }
                }
              };
              request.onerror = () => {
                console.log('getData-cursor-error');
              };
            }
          } else {
            resolve(null);
          }
        };
        request.onerror = () => {
          console.log('getData-count-error');
        };
      }
    });
    return promise;
  };

  // 获取所有数据用于保存为文件
  getAllData = (minTime: number, maxTime: number) => {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      const nameList = ['Goals', 'Tasks', 'Histories'];
      const listObj = Object.create(null);
      let i = 1;
      nameList.forEach((name: string) => {
        const p = this.getData(name, 'timeId', undefined, minTime, maxTime);
        console.log(minTime, 'max', maxTime);
        //浏览器的事件流机制?就是大任务和小任务那块,异步方法和同步的执行顺序
        p.then((data) => {
          listObj[name] = data ? data : [];
          if (i === nameList.length) {
            console.log(listObj);
            resolve(listObj);
          }
          i++;
        });
      });
    });
    return promise;
  };

  // 清空数据
  setDataNull = (name: string, minTime: number, maxTime: number) => {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      let keyRangeValue = IDBKeyRange.bound(minTime, maxTime);
      const request = _this.database
        ?.transaction(name, 'readwrite')
        .objectStore(name)
        .getAll(keyRangeValue);
      if (request) {
        request.onsuccess = () => {
          request.result.forEach((data) => {
            const p = this.remove(name, data.timeId);
            p.then((success) => {
              if (!success) {
                resolve(false);
                console.log('setDataNull-error');
              }
            });
          });
          resolve(true);
          console.log('setDataNull-success');
        };
        request.onerror = () => {};
      }
    });
    return promise;
  };
  // 重置数据
  setData = (
    name: string,
    data: any = [],
    minTime: number,
    maxTime: number,
  ) => {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      data.forEach((item: any, index: number) => {
        const p = this.add(name, item);
        p.then((success) => {
          if (!success) {
            resolve(false);
          } else {
            if (index === data.length - 1) {
              resolve(true);
            }
          }
        });
      });
    });
    return promise;
  };

  // 获取数据并覆盖数据库
  setAllData = (data: any, minTime: number, maxTime: number) => {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      // console.log(data);
      const nameList = ['Goals', 'Tasks', 'Histories'];
      const set = () => {
        let j = 1;
        nameList.forEach((name: string) => {
          const p = this.setData(name, data[name], minTime, maxTime);
          p.then((success) => {
            if (!success) {
              resolve(false);
            }
            if (j === nameList.length) {
              resolve(true);
            }
            j++;
          });
        });
      };
      // 清空
      let i = 1;
      nameList.forEach((name: string) => {
        const p = this.setDataNull(name, minTime, maxTime);
        p.then((success) => {
          if (!success) {
            resolve(false);
          } else {
            if (i === nameList.length) {
              // 结束清空,开始重置
              set();
            }
            i++;
          }
        });
      });
    });
    return promise;
  };
}

// 构造实例
const indexedDB = new IndexedDB();

export default indexedDB;
