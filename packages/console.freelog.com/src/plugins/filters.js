import {format} from 'date-fns'
import ACCOUNT_CONFIG from '../config/account'

export default (Vue) => {
    var isSupportWebp;
    (function isSupportWebp(callback) {
        var webP = new Image();
        webP.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';

        webP.onload = webP.onerror = function () {
            callback(webP.height === 1);
        };
    })((is) => {
        isSupportWebp = is
    });

    Vue.filter('humanizeNumber', value => value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'))

    Vue.filter('fmtDate', (value, frm) => {
        if (!value) return ''
        const date = new Date(value)
        frm = frm || 'YYYY-MM-DD'
        return format(date, frm)
    })

    // 单位转换+千分位格式化
    const ACCOUNT_MAP = Object.values(ACCOUNT_CONFIG).reduce((AccountMap, accountType) => {
        AccountMap[accountType.abbr] = accountType
        return AccountMap
    }, {})

    Vue.filter('humanizeCurrency', (value, abbr) => {
        if (!value) return '0'
        const account = ACCOUNT_MAP[abbr || 'feth']
        const values = (value / account.unit).toString().split('.', 2)
        // 123456789->12,3456,789
        return values[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + (values[1] === undefined ? '' : `.${values[1]}`)
    })


    Vue.filter('padImage', (value) => {
        if (!value) return ''

        if (value.indexOf('?') === -1) {
            value += '?'
        } else {
            value += '&'
        }
        value += `x-oss-process=style/${isSupportWebp ? 'webp' : 'jpg'}_image`
        return value
    })

    Vue.filter('pageBuildFilter', function (value) {
        if (!value) return '';
        if (value === 'page_build') {
            return 'theme';
        }
        return value;
    });

    Vue.filter('humanizeSize', function (number) {
        if (!number) {
            return '0 B';
        }

        const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

        if (!number) {
            return '';
        }

        if (number < 1) {
            return `${number} B`;
        }

        const algorithm = 1024;
        const exponent = Math.min(Math.floor(Math.log(number) / Math.log(algorithm)), UNITS.length - 1);
        number = Number((number / Math.pow(algorithm, exponent)).toPrecision(2));
        const unit = UNITS[exponent];

        return `${number} ${unit}`;
    });

    Vue.filter('momentFormat', function (data) {
        // const date = new Date(str);
        // return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        return data.split('T')[0];
    });

}
