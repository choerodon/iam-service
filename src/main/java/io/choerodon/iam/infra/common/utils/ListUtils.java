package io.choerodon.iam.infra.common.utils;

import java.util.ArrayList;
import java.util.List;

/**
 * @author superlee
 */
public class ListUtils {

    public static <T> List<List<T>> subList(List<T> originalList, int volume) {
        List<List<T>> list = new ArrayList<>();
        if (volume < 1) {
            return list;
        }
        int size = originalList.size();
        int count = (size % volume == 0) ? size/volume : size/volume + 1;
        int start = 0;
        int end = volume;
        if (size != 0) {
            for (int i = 0; i < count; i++) {
                end = end > size ? size : end;
                List<T> subList = originalList.subList(start, end);
                start = start + volume;
                end = end + volume;
                list.add(subList);
            }
        }
        return list;
    }
}
