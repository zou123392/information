import request from "@/utils/request";

/**
 * @description 加购
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function addShopcart(data) {
    return request({
        url: "/addShopcart",
        method: "POST",
        data,
        headers: {
            token: document.cookie,
        },
    });
}

/**
 * @description 更新加购数目
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function updateShopcartCount(data) {
    return request({
        url: "/updateShopcartCount",
        method: "POST",
        data,
        headers: {
            token: document.cookie,
        },
    });
}

/**
 * @description 更新购物车商品选择状态
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function updateShopcartCheck(data) {
    return request({
        url: "/updateShopcartCheck",
        method: "POST",
        data,
        headers: {
            token: document.cookie,
        },
    });
}

/**
 * @description 取消加购
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function removeShopcart(data) {
    return request({
        url: "/removeShopcart",
        method: "POST",
        data,
        headers: {
            token: document.cookie,
        },
    });
}

/**
 * @description 购物车商品
 * @param {object} params 请求参数,具体请查看接口文档
 */
export function shopcartProducts(params) {
    return request({
        url: "/shopcartProducts",
        method: "GET",
        params,
        headers: {
            token: document.cookie,
        },
    });
}

/**
 * @description 购物车总数
 * @param {object} params 请求参数,具体请查看接口文档
 */
export function shopcartCount(params) {
    return request({
        url: "/shopcartCount",
        method: "GET",
        params,
        headers: {
            token: document.cookie,
        },
    });
}
