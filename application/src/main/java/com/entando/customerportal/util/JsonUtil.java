package com.entando.customerportal.util;

import java.io.IOException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonUtil {
	
	public static String objectToJsonString(Object object) {
		String jsonStr = "";
		ObjectMapper Obj = new ObjectMapper();
		try {
			jsonStr = Obj.writeValueAsString(object);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return jsonStr;
	}
}
