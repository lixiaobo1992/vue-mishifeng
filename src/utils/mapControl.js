/**
 * 地图 控制类
 */
class MapControl {
  constructor(coordinate = []) {
    if (!coordinate.length) {
      console.log('缺少坐标！');
      return;
    }
    let lng = coordinate[0];
    // lng = lng.toString().split('.');
    // const tempLngTail = addBit(lng[1]);
    // lng = [lng[0], tempLngTail].join('.');

    let lat = coordinate[1];
    // lat = lat.toString().split('.');
    // const tempLatTail = addBit(lat[1]);
    // lat = [lat[0], tempLatTail].join('.');
    const { AMap } = window;
    this.coordinate = new AMap.LngLat(Number(lng), Number(lat));
    console.log(this.coordinate);
    this.initMap();
  }

  initMap() {
    const { AMap } = window;
    this.map = new AMap.Map('container', {
      resizeEnable: true,
      center: this.coordinate, // 地图中心点
      zoom: 13, // 地图显示的缩放级别
    });
  }

  // 添加标记
  addMarker() {
    try {
      const { AMap } = window;
      // console.log(this.marker);
      // console.log(this.map);
      // console.log(this.coordinate);
      this.marker = new AMap.Marker({
        map: this.map,
        position: this.coordinate,
        icon: new AMap.Icon({
          size: new AMap.Size(40, 50),
          image: 'https://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png',
          imageOffset: new AMap.Pixel(0, -60),
        }),
      });
    } catch (error) {
      console.log(error);
    }
  }
  // 标记控制
  markerControl(flag) {
    if (flag) {
      this.marker.show();
    } else {
      this.marker.hide();
    }
  }
  // pluginNames: ['AMap.ToolBar', 'AMap.Walking']
  addPlugin(pluginNames = []) {
    const { AMap } = window;
    return new Promise(function(resolve, reject) {
      for (let i = 0; i < pluginNames.length; i++) {
        const pluginName = pluginNames[i].split('.');
        console.log(pluginName[1]);
        if (AMap.hasOwnProperty(pluginName[1])) {
          resolve();
        }
      }
      AMap.plugin(pluginNames, function() {
        //...
        resolve();
      });
    });
  }
}

// function addBit(str) {
//   if (!str || str == '') return '';
//   for (let i = str.length; i < 6; i++) {
//     if (i == 3 || i == 5) {
//       str += '1';
//     } else {
//       str += '0';
//     }
//   }
//   return str;
// }

export default MapControl;
