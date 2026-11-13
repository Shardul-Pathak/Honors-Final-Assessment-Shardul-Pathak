package com.rbu.assessment.controller;

import com.rbu.assessment.dto.LeaderboardItemDto;
import com.rbu.assessment.dto.PagedResponse;
import com.rbu.assessment.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

// REST controller exposing paginated student leaderboard and ranking data
@RestController
@RequestMapping("/api/v1/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping
    public ResponseEntity<PagedResponse<LeaderboardItemDto>> getLeaderboard(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "totalPoints") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        PagedResponse<LeaderboardItemDto> response = leaderboardService.getLeaderboard(page, size, sortBy, direction);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-rank")
    public ResponseEntity<LeaderboardItemDto> getMyRank(Principal principal) {
        LeaderboardItemDto myRank = leaderboardService.getStudentRank(principal.getName());
        return ResponseEntity.ok(myRank);
    }
}
