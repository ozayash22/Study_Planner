package com.studyPlanner.study_planner.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    @RequestMapping(value = "/{path:[^\\.]*}")
    public String redirect() {
        // Forwards any unmapped paths (except those containing a period) to index.html
        return "forward:/index.html";
    }
}
