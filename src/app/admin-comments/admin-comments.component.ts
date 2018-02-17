import { Component, OnInit } from '@angular/core';
import {CommentService} from '../_services/comment.service';
import {AlertService} from '../_services/alert.service';
import {isBoolean, isNullOrUndefined} from 'util';
import {Comment} from '../_models/comment';

@Component({
	selector: 'app-admin-comments',
	templateUrl: './admin-comments.component.html',
	styleUrls: ['./admin-comments.component.css']
})
export class AdminCommentsComponent implements OnInit {

	commentOutput: Comment[];
	loading = false;

	constructor(
		private alertService: AlertService,
		private commentService: CommentService,
	) { }

	ngOnInit() {
		this.refreshComments();
	}

	deleteComment(comment: Comment) {
		if (confirm('Are You sure To Delete This ?')) {
			this.loading = true;
			this.commentService.delete(comment.id).subscribe(data => {
					if (data && !isNullOrUndefined(data.data) && data.data){
						this.refreshComments();
						this.alertService.success('Comment has been deleted...', false);
					}else{
						this.alertService.error('Sorry... An Error occurred, Unable to delete Comment');
					}
					this.loading = false;
				}, error => {
					this.alertService.error('Sorry... Error occurred, Unable to delete Comment');
					this.loading = false;
				}
			);
		}
	}

	refreshComments() {
		this.commentService.getAll().subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)){
					this.commentOutput = data.data;
				}
			},
		);
	}

}
