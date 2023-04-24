using Microsoft.AspNetCore.SignalR;

namespace SignalRChat.Hubs
{
    public class VoteList
    {
        public List<int> count;
        public VoteList()
        {
            count = new List<int>{0, 0, 0, 0, 0, 0};
        }

        public List<int> GetVote()
        {
            return count;
        }

        public List<int> AddVote(int index)
        {
            count[index] += 1;
            return count;   
        }

        public List<int> Reset()
        {
            for (int i = 0; i < count.Count; i++){
                count[i] = 0;
            }
            return count;
        }

    }



    public class ChatHub : Hub
    {

        private VoteList voteList;
        public ChatHub(VoteList vote)
        {
            voteList = vote;
        }

        public async Task VoteToCaller()
        {
            await Clients.Caller.SendAsync("ReceiveVoteCount", voteList.GetVote());
        }

        public async Task VoteAdd(int idx)
        {
            await Clients.Caller.SendAsync("AddVoteCount", voteList.AddVote(idx));
            await Clients.All.SendAsync("ReceiveVoteCount", voteList.GetVote());
        }

        public async Task Reset(){
            await Clients.Caller.SendAsync("ResetVoteCount", voteList.Reset());
            await Clients.All.SendAsync("ReceiveVoteCount", voteList.GetVote());
        }
    }
}