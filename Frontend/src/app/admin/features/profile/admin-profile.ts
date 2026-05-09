import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, AvatarModule],
  templateUrl: './admin-profile.html',
  styleUrls: ['./admin-profile.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProfile {
  private accountService = inject(AccountService);

  currentUser = this.accountService.currentUser;
  avatarLabel = computed(() => this.currentUser()?.displayName?.charAt(0).toUpperCase() || 'A');
  avatarUrl = computed(() => this.accountService.resolveImageUrl(this.currentUser()?.imageUrl));
}
