/**
 * Created by hulingfangzi on 2018/5/28.
 */
import { action, computed, observable } from 'mobx';
import { store } from '@choerodon/boot';

@store('RouteStore')
class RouteStore {

}

const routeStore = new RouteStore();

export default routeStore;
