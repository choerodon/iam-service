package io.choerodon.iam.infra.common.utils;

import java.util.ArrayList;
import java.util.List;

/**
 * @author superlee
 */
public class ListUtils {

    public static <T> List<List<T>> subList(List<T> originalList, int volume) {
        List<List<T>> list = new ArrayList<>();
        int size = originalList.size();
        int count = size/volume + 1;
        int start = 0;
        int end = volume - 1;
        if (size != 0) {
            for (int i = 0; i < count; i++) {
                end = end > size - 1 ? size - 1 : end;
                List<T> subList = originalList.subList(start, end);
                start = start + volume;
                end = end + volume;
                list.add(subList);
            }
        }
        return list;
    }
}
