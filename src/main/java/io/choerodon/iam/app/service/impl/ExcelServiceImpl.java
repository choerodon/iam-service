package io.choerodon.iam.app.service.impl;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.excel.ExcelExportHelper;
import io.choerodon.core.excel.ExcelReadConfig;
import io.choerodon.core.excel.ExcelReadHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.api.dto.ErrorUserDTO;
import io.choerodon.iam.api.dto.UploadHistoryDTO;
import io.choerodon.iam.app.service.ExcelService;
import io.choerodon.iam.app.service.OrganizationUserService;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.infra.common.utils.ListUtils;
import io.choerodon.iam.infra.common.utils.MockMultipartFile;
import io.choerodon.iam.infra.dataobject.UploadHistoryDO;
import io.choerodon.iam.infra.dataobject.UserDO;
import io.choerodon.iam.infra.feign.FileFeignClient;
import io.choerodon.iam.infra.mapper.UploadHistoryMapper;
import io.choerodon.iam.infra.mapper.UserMapper;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.lang.reflect.InvocationTargetException;
import java.net.URLEncoder;
import java.util.*;

/**
 * @author superlee
 */
@Service
public class ExcelServiceImpl implements ExcelService {

    private final Logger logger = LoggerFactory.getLogger(ExcelServiceImpl.class);

    private OrganizationUserService organizationUserService;

    private static final BCryptPasswordEncoder ENCODER = new BCryptPasswordEncoder();

    private UserRepository userRepository;

    private UploadHistoryMapper uploadHistoryMapper;

    private FileFeignClient fileFeignClient;

//    @Autowired
//    private UserMapper userMapper;


    public ExcelServiceImpl(OrganizationUserService organizationUserService,
                            UserRepository userRepository,
                            UploadHistoryMapper uploadHistoryMapper,
                            FileFeignClient fileFeignClient) {
        this.organizationUserService = organizationUserService;
        this.userRepository = userRepository;
        this.uploadHistoryMapper = uploadHistoryMapper;
        this.fileFeignClient = fileFeignClient;
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    public UploadHistoryDTO importUsers(Long id, MultipartFile multipartFile) {
        //todo 考虑如何用异步任务优化
        List<UserDO> insertUsers = new ArrayList<>();
        List<ErrorUserDTO> errorUsers = new ArrayList<>();
        ExcelReadConfig excelReadConfig = initExcelReadConfig();
        try {
            //todo 读取到的用户根据loginName和email去重
            List<UserDO> users = ExcelReadHelper.read(multipartFile, UserDO.class, excelReadConfig);
            users.forEach(u -> {
                u.setOrganizationId(id);
                processUsers(u, errorUsers, insertUsers);
            });
        } catch (IOException | IllegalAccessException | InstantiationException | InvocationTargetException e) {
            logger.info("something wrong was happened when reading the excel, exception : {}", e.getMessage());
            throw new CommonException("error.excel.read");
        }
        List<List<UserDO>> list = ListUtils.subList(insertUsers, 1000);
        list.forEach(l -> {
            if (!l.isEmpty()) {
                organizationUserService.batchCreateUsers(l);
            }
        });
        Integer successCount = insertUsers.size();
        Integer failCount = errorUsers.size();
        String url = "";
        if (failCount > 0) {
            //失败的用户导出到excel
            url = exportAndUpload(errorUsers);
        }
        //插入uploadHistory
        UploadHistoryDO uploadHistory = insert2UploadHistory(successCount, failCount, url);
        return ConvertHelper.convert(uploadHistory, UploadHistoryDTO.class);
    }

    private UploadHistoryDO insert2UploadHistory(Integer successCount, Integer failCount, String url) {
        UploadHistoryDO uploadHistory = new UploadHistoryDO();
        uploadHistory.setSuccessCount(successCount);
        uploadHistory.setFailCount(failCount);
        uploadHistory.setUrl(url);
        uploadHistory.setUserId(DetailsHelper.getUserDetails().getUserId());
        uploadHistory.setType("user");
        uploadHistoryMapper.insertSelective(uploadHistory);
        return uploadHistory;
    }

    private String exportAndUpload(List<ErrorUserDTO> errorUsers) {
        Map<String, String> propertyMap = new LinkedHashMap<>();
        propertyMap.put("loginName", "登录名*");
        propertyMap.put("realName", "用户名*");
        propertyMap.put("email", "邮箱*");
        propertyMap.put("password", "密码");
        propertyMap.put("phone", "手机号");
        propertyMap.put("cause", "原因");
        HSSFWorkbook hssfWorkbook;
        try {
            hssfWorkbook = ExcelExportHelper.exportExcel2003(propertyMap,errorUsers,"error users",ErrorUserDTO.class);
        } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
            logger.info("something wrong was happened when exporting the excel, exception : {}", e.getMessage());
            throw new CommonException("error.excel.export");
        }
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        String url;
        try {
            hssfWorkbook.write(bos);
            MockMultipartFile multipartFile =
                    new MockMultipartFile("file","errorUser.xls","application/vnd.ms-excel", bos.toByteArray());
            url = fileFeignClient.uploadFile("error-user", multipartFile.getOriginalFilename(), multipartFile).getBody();
        } catch (IOException e) {
            logger.info("HSSFWorkbook to ByteArrayOutputStream failed, exception: {}", e.getMessage());
            throw new CommonException("error.byteArrayOutputStream");
        } finally {
            try {
                bos.close();
            } catch (IOException e) {
                logger.info("byteArrayOutputStream close failed, exception: {}", e.getMessage());
            }
        }
        return url;
    }

    private ExcelReadConfig initExcelReadConfig() {
        ExcelReadConfig excelReadConfig = new ExcelReadConfig();
        String[] skipSheetNames = {"readme"};
        Map<String, String> propertyMap = new HashMap<>();
        propertyMap.put("登录名*", "loginName");
        propertyMap.put("用户名*", "realName");
        propertyMap.put("邮箱*", "email");
        propertyMap.put("密码", "password");
        propertyMap.put("手机号", "phone");
        excelReadConfig.setSkipSheetNames(skipSheetNames);
        excelReadConfig.setPropertyMap(propertyMap);
        return excelReadConfig;
    }

    @Override
    public Resource getUserTemplates() {
        InputStream inputStream = this.getClass().getResourceAsStream("/templates/userTemplates.xlsx");
        return new InputStreamResource(inputStream);
    }

    @Override
    public HttpHeaders getHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
        headers.add("Pragma", "no-cache");
        headers.add("Expires", "0");
        headers.add("charset", "utf-8");
        //设置下载文件名
        String filename = null;
        try {
            filename = URLEncoder.encode("用户导入模版.xlsx", "UTF-8");
        } catch (UnsupportedEncodingException e) {
            logger.info("url encodes exception: {}", e.getMessage());
            throw new CommonException("error.encode.url");
        }
        headers.add("Content-Disposition", "attachment;filename=\"" + filename + "\"");
        return headers;
    }

//    @Override
//    public void export() {
//        List<UserDO> users = userMapper.selectAll();
//        Map<String, String> propertyMap = new LinkedHashMap<>();
//        propertyMap.put("loginName", "登录名*");
//        propertyMap.put("realName", "用户名*");
//        propertyMap.put("email", "邮箱*");
//        propertyMap.put("password", "密码");
//        propertyMap.put("phone", "手机号");
////        propertyMap.put("cause", "原因");
//        FileOutputStream out = null;
//        try {
//            out = new FileOutputStream("D:\\xxx.xls");
//            HSSFWorkbook hssfWorkbook = ExcelExportHelper.exportExcel2003(propertyMap, users,"sheet", UserDO.class);
//            hssfWorkbook.write(out);
//        } catch (NoSuchMethodException e) {
//            e.printStackTrace();
//        } catch (IllegalAccessException e) {
//            e.printStackTrace();
//        } catch (InvocationTargetException e) {
//            e.printStackTrace();
//        } catch (FileNotFoundException e) {
//            e.printStackTrace();
//        } catch (IOException e) {
//            e.printStackTrace();
//        } finally {
//            if (out != null) {
//                try {
//                    out.close();
//                } catch (IOException e) {
//                    e.printStackTrace();
//                }
//            }
//        }
//    }

    private void processUsers(UserDO user, List<ErrorUserDTO> errorUsers, List<UserDO> insertUsers) {
        String loginName = user.getLoginName();
        String email = user.getEmail();
        if (loginNameIsExisted(loginName)) {
            ErrorUserDTO errorUser = new ErrorUserDTO();
            BeanUtils.copyProperties(user, errorUser);
            errorUser.setCause("登录名已存在");
            errorUsers.add(errorUser);
        } else if (emailIsExisted(email)) {
            ErrorUserDTO errorUser = new ErrorUserDTO();
            BeanUtils.copyProperties(user, errorUser);
            errorUser.setCause("邮箱已存在");
            errorUsers.add(errorUser);
        } else {
            insertUsers.add(user);
        }
        //excel中用户密码为空，设置默认密码为abcd1234
        if (StringUtils.isEmpty(user.getPassword())) {
            user.setPassword("abcd1234");
        }
        //加密
        user.setPassword(ENCODER.encode(user.getPassword()));
        if (StringUtils.isEmpty(user.getLanguage())) {
            user.setLanguage("zh_CN");
        }
        if (StringUtils.isEmpty(user.getTimeZone())) {
            user.setTimeZone("CTT");
        }
        user.setLastPasswordUpdatedAt(new Date(System.currentTimeMillis()));
        user.setEnabled(true);
        user.setLocked(false);
        user.setLdap(false);
        user.setAdmin(false);
    }

    private boolean emailIsExisted(String email) {
        UserDO userDO = new UserDO();
        userDO.setEmail(email);
        return userRepository.selectOne(userDO) != null;
    }

    private boolean loginNameIsExisted(String loginName) {
        UserDO userDO = new UserDO();
        userDO.setLoginName(loginName);
        return userRepository.selectOne(userDO) != null;
    }
}
