'use strict'
import { Promise } from 'es6-promise'
const store = {}

export default store

/**
 * 发送restful请求
 * @param instance 组件实例
 * @param method 请求方式 ['get' | 'post' | 'jsonp' | 'put' | 'delete' | 'save' | 'update' | 'remove']
 * @param url 请求地址
 * @param params 附加信息
 * @param success 成功回调
 * @param failed 失败回调
 */
store.myHttp = (instance, method, url, params, success, failed, noShowMsg = false) => {
  return new Promise(function (resolve, reject) {
    instance.$http[method](url, params).then(res => {
      if (typeof res.data === 'string') {
        try {
          res.data = res.json()
        } catch (e) {
        }
      }
      if (success !== undefined) {
        success(res)
      }
      resolve(res.data)
    }, res => {
      if (typeof res.data === 'string') {
        try {
          res.data = res.json()
        } catch (e) {
        }
      }
      if (failed !== undefined) {
        failed(res)
      }
      if (!noShowMsg) {
        // 失败
        if (res.data === '') {
          instance.$root.showMessage('出错了')
        } else {
          if (typeof res.data === 'string') {
            instance.$root.showMessage(res.data)
          } else {
            instance.$root.showMessage(res.data.message)
          }
        }
      }
      reject(res)
    })
  })
}
/**
 * 登陆
 */
store.login = (studentName, password, instance) => {
  instance.$root.showLoading('登陆中')
  return store.myHttp(instance, 'post', 'login', {
    student_name: studentName,
    password: password,
    remember: 'true'
  }, res => {
    instance.$root.loading.show = false
    instance.$root.option.menus.uname = res.data.student_name
    window.localStorage.uname = res.data.student_name
  }, res => {
    instance.$root.loading.show = false
  }, true)
}
/**
 * 获取当前用户信息
 */
store.getMe = (instance, noShowMsg) => {
  return store.myHttp(instance, 'get', 'me', undefined, undefined, undefined, true)
}

/**
 * 确认报道
 */
store.report = (height, weight, remarks = '', instance) => {
  instance.$root.showLoading('加载中')
  return store.myHttp(instance, 'post', 'report', {
    height: height,
    weight: weight,
    remarks: remarks
  }, res => {
    instance.$root.loading.show = false
  }, res => {
    let msg = ''
    if (res.status === 422) {
      for (let index in res.data.errors) {
        msg += res.data.errors[index][0]
      }
      instance.$root.showMessage(msg)
    }
    instance.$root.loading.show = false
  }, true)
}

/**
 * 获取可选宿舍
 */
store.getDorms = (instance) => {
  instance.$root.showLoading('加载中')
  return store.myHttp(instance, 'get', 'dorms', {}, res => {
    instance.$root.loading.show = false
  }, res => {
    instance.$root.loading.show = false
  })
}

/**
 * 选择宿舍床位
 * @param dormId 宿舍id
 * @param bedId 床位id 如果是选择插宿舍则bedId传0
 */
store.selBed = (dormId, bedId, instance) => {
  instance.$root.showLoading('请稍候')
  return store.myHttp(instance, 'post', 'dorm/' + dormId + '/bed/' + bedId, {}, res => {
    instance.$root.loading.show = false
  }, res => {
    instance.$root.loading.show = false
  })
}

/**
 * 获取室友
 */
store.getRoomMates = (instance) => {
  return store.myHttp(instance, 'get', 'roommates')
}

/**
 *  判断学号是否存在
 *  @param studentId 学号
 *  exists_student_num
 */
/*
store.studentIdIsExit = (studentId, instance) => {
  instance.$root.showLoading('请稍候')
  return store.myHttp(instance, 'get', 'exists_student_num/' + studentId, {}, res => {
    instance.$root.loading.show = false
  }, res => {
    instance.$root.loading.show = false
  })
}
*/

/**
 * 判断姓名是否存在
 */
store.studentNameIsExit = (studentName, instance) => {
  instance.$root.showLoading('请稍候')
  return store.myHttp(instance, 'get', 'exists_student_name/' + studentName, {}, res => {
    instance.$root.loading.show = false
  }, res => {
    instance.$root.loading.show = false
  })
}
/**
 *  退出登陆
 */
store.logOut = (instance) => {
  window.localStorage.removeItem('uname')
  return store.myHttp(instance, 'get', 'logout')
}
/**
 * 搜索学生
 * @param  {String} keyWord  关键字
 */
store.searchStudents = (instance, keyWord) => {
  return store.myHttp(instance, 'get', 'search_students/' + keyWord)
}

/**
* 获取宿舍床位信息
*/
store.getDormBeds = (dormId, instance) => {
  return store.myHttp(instance, 'get', 'dorm_beds_detail/' + dormId)
}
